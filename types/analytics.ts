export type DomainStatus = "verified" | "failed";

export interface DomainHealthSummary {
  spfStatus: DomainStatus;
  dkimStatus: DomainStatus;
  dmarcStatus: DomainStatus;
  reputation: number;
  lastCheckedAt: string | Date | null;
}

export interface TrendPoint {
  day: string;
  value: number;
}

export interface AnalyticsResponse {
  totalEmailsSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalHardBounces: number;
  totalSoftBounces: number;
  spamComplaints: number;
  unsubscribeCount: number;
  deliveryRate: number;
  openRate: number;
  ctr: number;
  bounceRate: number;
  unsubscribeRate: number;
  totalContacts: number;
  totalCampaigns: number;
  sentCampaigns: number;
  domainHealth: DomainHealthSummary;
  deliveryTrend: TrendPoint[];
  openTrend: TrendPoint[];
  bounceTrend: TrendPoint[];
  topCampaigns: Array<{
    _id: string;
    title: string;
    status: string;
    sentCount?: number;
    totalRecipients?: number;
    createdAt?: string | Date;
  }>;
}
