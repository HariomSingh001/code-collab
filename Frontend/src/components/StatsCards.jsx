import { Activity, Flame, Trophy, Clock } from "lucide-react";

const Stat = ({ icon: Icon, label, value, accent, hint }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-base-100 border border-base-content/10 p-5 hover:border-primary/40 transition-colors">
    <div
      className={`absolute -top-10 -right-10 size-28 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition ${accent}`}
    />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {hint && <p className="mt-1 text-xs text-base-content/50">{hint}</p>}
      </div>
      <div className="size-11 rounded-xl bg-base-200 grid place-items-center">
        <Icon className="size-5" />
      </div>
    </div>
  </div>
);

const StatsCards = ({ activeSessionsCount = 0, recentSessionsCount = 0 }) => {
  return (
    <div className="lg:col-span-1 grid grid-cols-2 gap-4 content-start">
      <Stat
        icon={Activity}
        label="Active"
        value={activeSessionsCount}
        accent="bg-primary"
        hint="Live sessions"
      />
      <Stat
        icon={Clock}
        label="Recent"
        value={recentSessionsCount}
        accent="bg-secondary"
        hint="Last 7 days"
      />
      <Stat icon={Flame} label="Streak" value="5d" accent="bg-warning" hint="Keep going!" />
      <Stat icon={Trophy} label="Solved" value="12" accent="bg-success" hint="Problems done" />
    </div>
  );
};

export default StatsCards;
