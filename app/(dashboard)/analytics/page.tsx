"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart3,
  MailCheck,
  MousePointerClick,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ShieldCheck,
  Gauge,
  Mail,
} from "lucide-react";

import DomainHealthCard from "@/components/analytics/DomainHealthCard";
import TrendChart from "@/components/analytics/TrendChart";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    void fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex min-h-80 items-center justify-center p-10">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-xl bg-blue-100" />
            <p className="text-sm font-medium text-slate-500">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const performanceMetrics = [
    {
      title: "Total Emails Sent",
      value: analytics.totalEmailsSent || 0,
      change: "+12%",
      icon: BarChart3,
    },
    {
      title: "Delivery Rate",
      value: `${analytics.deliveryRate ?? 0}%`,
      change: analytics.deliveryRate > 90 ? "+2%" : "+0%",
      icon: MailCheck,
    },
    {
      title: "Open Rate",
      value: `${analytics.openRate ?? 0}%`,
      change: analytics.openRate > 20 ? "+4%" : "+0%",
      icon: MousePointerClick,
    },
    {
      title: "Bounce Rate",
      value: `${analytics.bounceRate ?? 0}%`,
      change: analytics.bounceRate > 5 ? "-2%" : "+0%",
      icon: AlertTriangle,
    },
  ];

  const domainHealth = analytics.domainHealth || {
    spfStatus: "failed",
    dkimStatus: "failed",
    dmarcStatus: "failed",
    reputation: 0,
    lastCheckedAt: null,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50/70 px-6 py-7 shadow-sm sm:px-8">
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Deliverability overview
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Domain Health & Email Deliverability
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Track DNS authentication, inbox placement, engagement quality, and reputation health.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live deliverability signals
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const iconStyles = [
              "bg-blue-50 text-blue-600 ring-blue-100",
              "bg-violet-50 text-violet-600 ring-violet-100",
              "bg-emerald-50 text-emerald-600 ring-emerald-100",
              "bg-amber-50 text-amber-600 ring-amber-100",
              "bg-rose-50 text-rose-600 ring-rose-100",
            ];

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {metric.title}
                  </span>

                  <div className={`rounded-xl p-2.5 ring-1 ${iconStyles[index]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    {metric.value}
                  </h3>

                  {(() => {
                    const isPositive = metric.change.startsWith("+");
                    return (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${
                          isPositive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="mr-0.5 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-0.5 h-3 w-3" />
                        )}
                        {metric.change}
                      </span>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_2.8fr]">
          <DomainHealthCard health={domainHealth} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Delivered</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{analytics.totalDelivered || 0}</h3>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Clicked</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{analytics.totalClicked || 0}</h3>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Spam complaints</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{analytics.spamComplaints || 0}</h3>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
                  <Gauge className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Unsubscribed</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{analytics.unsubscribeCount || 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TrendChart
            title="Delivery Trend"
            subtext="Email deliveries over the last 7 days"
            color="emerald"
            data={analytics.deliveryTrend || []}
          />
          <TrendChart
            title="Open Trend"
            subtext="Unique opens over the last 7 days"
            color="blue"
            data={analytics.openTrend || []}
          />
          <TrendChart
            title="Bounce Trend"
            subtext="Hard and soft bounces over the last 7 days"
            color="rose"
            data={analytics.bounceTrend || []}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recent Campaigns</h3>
              <p className="mt-1 text-xs text-slate-500">Your latest campaign delivery activity</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
              Latest results
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
            {(analytics.topCampaigns || []).map((camp: any) => (
              <div
                key={camp._id}
                className="group rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                  {camp.title}
                </h4>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <p className="rounded-lg bg-white px-2.5 py-2 text-slate-500 shadow-sm">
                    Sent:
                    <span className="ml-1 font-semibold text-slate-700">
                      {camp.sentCount || 0}
                    </span>
                  </p>

                  <p className="rounded-lg bg-white px-2.5 py-2 text-slate-500 shadow-sm">
                    Recipients:
                    <span className="ml-1 font-semibold text-slate-700">
                      {camp.totalRecipients || 0}
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                      camp.status === "sent"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
