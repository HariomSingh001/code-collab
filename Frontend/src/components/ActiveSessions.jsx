import { Radio, Users, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router";

const DifficultyBadge = ({ difficulty }) => {
  const map = {
    easy: "badge-success",
    medium: "badge-warning",
    hard: "badge-error",
  };
  return (
    <span className={`badge badge-sm ${map[difficulty?.toLowerCase()] || "badge-ghost"} capitalize`}>
      {difficulty}
    </span>
  );
};

const SessionRow = ({ session, isUserInSession }) => {
  const inSession = isUserInSession?.(session);
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-base-200/50 hover:bg-base-200 border border-transparent hover:border-base-content/10 transition">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 grid place-items-center">
            <Radio className="size-4 text-primary" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-success ring-2 ring-base-100 animate-pulse" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{session.problem || "Untitled Problem"}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-base-content/60">
            <DifficultyBadge difficulty={session.difficulty} />
            <span className="inline-flex items-center gap-1">
              <Users className="size-3" />
              {session.participantCount ?? (session.participant ? 2 : 1)}/2
            </span>
          </div>
        </div>
      </div>
      <Link
        to={`/session/${session._id}`}
        className={`btn btn-sm ${inSession ? "btn-primary" : "btn-ghost"} gap-1`}
      >
        {inSession ? "Rejoin" : "Join"}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
};

const ActiveSessions = ({ sessions = [], isLoading, isUserInSession }) => {
  return (
    <div className="lg:col-span-2 rounded-2xl bg-base-100 border border-base-content/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            Active Sessions
          </h2>
          <p className="text-sm text-base-content/60">Jump into an ongoing interview</p>
        </div>
        <span className="badge badge-ghost">{sessions.length}</span>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="size-6 animate-spin text-base-content/50" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-base-content/10 rounded-xl">
          <Radio className="size-8 text-base-content/30 mx-auto mb-2" />
          <p className="font-medium">No active sessions</p>
          <p className="text-sm text-base-content/50">Create one to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <SessionRow key={s._id} session={s} isUserInSession={isUserInSession} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveSessions;
