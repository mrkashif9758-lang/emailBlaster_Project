import { CheckCircle2, ShieldAlert } from "lucide-react";

interface DomainHealthCardProps {
  health: {
    spfStatus?: "verified" | "failed";
    dkimStatus?: "verified" | "failed";
    dmarcStatus?: "verified" | "failed";
    reputation?: number;
    lastCheckedAt?: string | Date | null;
  };
}

export default function DomainHealthCard({ health }: DomainHealthCardProps) {
  const records = [
    { label: "SPF", value: health.spfStatus || "failed" },
    { label: "DKIM", value: health.dkimStatus || "failed" },
    { label: "DMARC", value: health.dmarcStatus || "failed" },
  ];

  const reputation = health.reputation ?? 0;
  const reputationTone =
    reputation >= 90 ? "text-emerald-700 bg-emerald-100 border-emerald-200" :
    reputation >= 70 ? "text-amber-700 bg-amber-100 border-amber-200" :
    "text-rose-700 bg-rose-100 border-rose-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Domain health</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Authentication & reputation</h3>
        </div>
        <div className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${reputationTone}`}>
          {reputation}/100
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {records.map((record) => {
          const verified = record.value === "verified";

          return (
            <div
              key={record.label}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                {verified ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    <ShieldAlert className="h-4 w-4" />
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-700">{record.label}</span>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                  verified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {verified ? "Verified" : "Failed"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">Domain Reputation</span>
          <span className="font-bold text-slate-900">{reputation}/100</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${
              reputation >= 90
                ? "bg-emerald-500"
                : reputation >= 70
                  ? "bg-amber-500"
                  : "bg-rose-500"
            }`}
            style={{ width: `${reputation}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Last checked: {health.lastCheckedAt ? new Date(health.lastCheckedAt).toLocaleString() : "Not available"}
      </p>
    </div>
  );
}
