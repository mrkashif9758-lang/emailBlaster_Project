import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { calculateDomainReputation } from "@/lib/domainHealth";

import Campaign from "@/models/Campaign";
import Contact from "@/models/Contact";
import DomainHealth from "@/models/DomainHealth";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function buildLast7DaysTrend() {
  const now = new Date();
  const entries: Array<{ label: string; date: Date }> = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    entries.push({
      label: DAY_LABELS[date.getDay()],
      date,
    });
  }

  return entries;
}

export async function GET() {
  try {
    await connectDB();

    const totalContacts = await Contact.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const sentCampaigns = await Campaign.countDocuments({ status: "sent" });

    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    const totalEmailsSent = campaigns.reduce(
      (sum, campaign) => sum + (campaign.sentCount || 0),
      0
    );

    const totalDelivered = campaigns.reduce(
      (sum, campaign) => sum + (campaign.deliveredCount || 0),
      0
    );

    const totalOpened = campaigns.reduce(
      (sum, campaign) => sum + (campaign.openCount || 0),
      0
    );

    const totalClicked = campaigns.reduce(
      (sum, campaign) => sum + (campaign.clickCount || 0),
      0
    );

    const totalHardBounces = campaigns.reduce(
      (sum, campaign) => sum + (campaign.hardBounceCount || 0),
      0
    );

    const totalSoftBounces = campaigns.reduce(
      (sum, campaign) => sum + (campaign.softBounceCount || 0),
      0
    );

    const spamComplaints = campaigns.reduce(
      (sum, campaign) => sum + (campaign.spamComplaintCount || 0),
      0
    );

    const unsubscribeCount = campaigns.reduce(
      (sum, campaign) => sum + (campaign.unsubscribeCount || 0),
      0
    );

    const totalEmailsAttempted = Math.max(
      totalDelivered + totalHardBounces + totalSoftBounces,
      totalEmailsSent,
      1
    );

    const deliveryRate = totalEmailsAttempted > 0
      ? Number(((totalDelivered / totalEmailsAttempted) * 100).toFixed(2))
      : 0;

    const openRate = totalDelivered > 0
      ? Number(((totalOpened / totalDelivered) * 100).toFixed(2))
      : 0;

    const ctr = totalOpened > 0
      ? Number(((totalClicked / totalOpened) * 100).toFixed(2))
      : 0;

    const bounceRate = totalEmailsAttempted > 0
      ? Number((((totalHardBounces + totalSoftBounces) / totalEmailsAttempted) * 100).toFixed(2))
      : 0;

    const unsubscribeRate = totalEmailsAttempted > 0
      ? Number(((unsubscribeCount / totalEmailsAttempted) * 100).toFixed(2))
      : 0;

    const domainRecord = await DomainHealth.findOne({}).sort({ lastCheckedAt: -1 }).lean();
    const domainHealth = {
      spfStatus: domainRecord?.spfStatus || "failed",
      dkimStatus: domainRecord?.dkimStatus || "failed",
      dmarcStatus: domainRecord?.dmarcStatus || "failed",
      reputation: domainRecord?.reputation || calculateDomainReputation({
        bounceRate,
        spamComplaints,
        unsubscribeRate,
        openRate,
        deliveryRate,
      }),
      lastCheckedAt: domainRecord?.lastCheckedAt || null,
    };

    const last7Days = buildLast7DaysTrend();
    const deliveryTrendMap: Record<string, number> = {};
    const openTrendMap: Record<string, number> = {};
    const bounceTrendMap: Record<string, number> = {};

    for (const { date } of last7Days) {
      const key = getDayKey(date);
      deliveryTrendMap[key] = 0;
      openTrendMap[key] = 0;
      bounceTrendMap[key] = 0;
    }

    for (const campaign of campaigns) {
      if (campaign.sentAt) {
        const sentDate = new Date(campaign.sentAt);
        const key = getDayKey(sentDate);
        if (key in deliveryTrendMap) {
          deliveryTrendMap[key] += campaign.deliveredCount || campaign.sentCount || 0;
        }
      }

      if (campaign.openCount) {
        const activityDates = campaign.openHistory || [];
        for (const activity of activityDates) {
          const openDate = new Date(activity.date || activity.createdAt || campaign.sentAt || Date.now());
          const key = getDayKey(openDate);
          if (key in openTrendMap) {
            openTrendMap[key] += activity.count || 1;
          }
        }
      }

      const failedEmails = campaign.failedEmails || [];
      for (const failure of failedEmails) {
        if (!failure.date) continue;
        const failureDate = new Date(failure.date);
        const key = getDayKey(failureDate);
        if (key in bounceTrendMap) {
          bounceTrendMap[key] += 1;
        }
      }
    }

    const deliveryTrend = last7Days.map(({ label, date }) => ({
      day: label,
      value: deliveryTrendMap[getDayKey(date)] || 0,
    }));

    const openTrend = last7Days.map(({ label, date }) => ({
      day: label,
      value: openTrendMap[getDayKey(date)] || 0,
    }));

    const bounceTrend = last7Days.map(({ label, date }) => ({
      day: label,
      value: bounceTrendMap[getDayKey(date)] || 0,
    }));

    const topCampaigns = campaigns.slice(0, 4).map((campaign) => ({
      _id: String(campaign._id),
      title: campaign.title,
      status: campaign.status,
      sentCount: campaign.sentCount || 0,
      totalRecipients: campaign.totalRecipients || 0,
      createdAt: campaign.createdAt,
    }));

    return NextResponse.json({
      totalContacts,
      totalCampaigns,
      sentCampaigns,
      totalEmailsSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalHardBounces,
      totalSoftBounces,
      spamComplaints,
      unsubscribeCount,
      deliveryRate,
      openRate,
      ctr,
      bounceRate,
      unsubscribeRate,
      domainHealth,
      deliveryTrend,
      openTrend,
      bounceTrend,
      topCampaigns,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Analytics Error" }, { status: 500 });
  }
}
