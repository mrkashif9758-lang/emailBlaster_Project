import { CalendarDays } from "lucide-react";

interface TrendChartProps {
  title: string;
  subtext: string;
  color: "emerald" | "blue" | "rose";
  data?: Array<{ day: string; value: number }>;
}

const palette = {
  emerald: "from-emerald-600 to-emerald-400",
  blue: "from-blue-600 to-blue-400",
  rose: "from-rose-600 to-rose-400",
};

export default function TrendChart({
  title,
  subtext,
  color,
  data = [],
}: TrendChartProps) {
  const maxValue = Math.max(...data.map((entry) => entry.value), 1);
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-6 pb-5">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <p className="mt-2 text-xs text-slate-500">{subtext}</p>
        </div>
        <span className="mr-6 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          Last 7 days
        </span>
      </div>

      <div className="grid grid-cols-2 border-y border-slate-100 bg-slate-50/70 sm:grid-cols-2">
        <div className="border-r border-slate-100 px-6 py-4">
          <p className="text-xs font-medium text-slate-500">Total</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">{total.toLocaleString()}</p>
        </div>
        <div className="px-6 py-4">
          <p className="text-xs font-medium text-slate-500">Peak</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-slate-800">{maxValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-64 px-6 pb-5 pt-6">
        <div className="flex h-full items-end justify-between gap-3">
          {data.map((item, index) => (
            <div key={`${item.day}-${index}`} className="group flex h-full flex-1 flex-col items-center gap-3">
              <div className="relative flex w-full flex-1 items-end rounded-lg bg-slate-100/80 px-1.5 pt-2">
                <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                  {item.value.toLocaleString()}
                </div>
                <div
                  className={`w-full rounded-md rounded-b-sm bg-gradient-to-t ${palette[color]} shadow-[0_-4px_12px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out`}
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: item.value > 0 ? "4px" : "0",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-700">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
