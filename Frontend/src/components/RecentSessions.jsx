import { CheckCircle2, XCircle, History, Loader2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const StatusIcon = ({ status }) => {
  if (status === "completed")
    return <CheckCircle2 className="size-4 text-success" />;
  if (status === "abandoned") return <XCircle className="size-4 text-error" />;
  return <History className="size-4 text-base-content/50" />;
};

const RecentSessions = ({ sessions = [], isLoading }) => {
  return (
    <div className="mt-6 rounded-2xl bg-base-100 border border-base-content/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Recent Sessions</h2>
          <p className="text-sm text-base-content/60">Your interview history</p>
        </div>
        <span className="badge badge-ghost">{sessions.length}</span>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="size-6 animate-spin text-base-content/50" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-base-content/10 rounded-xl">
          <History className="size-8 text-base-content/30 mx-auto mb-2" />
          <p className="font-medium">No recent sessions</p>
          <p className="text-sm text-base-content/50">Your history will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-xs uppercase text-base-content/60">
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Partner</th>
                <th>Status</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id} className="hover">
                  <td className="font-medium">{s.problem || "—"}</td>
                  <td>
                    <span className="capitalize text-sm">{s.difficulty || "—"}</span>
                  </td>
                  <td className="text-sm text-base-content/70">
                    {s.participant?.name || s.host?.name || "Solo"}
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 text-sm capitalize">
                      <StatusIcon status={s.status} />
                      {s.status || "ended"}
                    </span>
                  </td>
                  <td className="text-sm text-base-content/60">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {s.createdAt
                        ? formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })
                        : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentSessions;
