import { X, Loader2 } from "lucide-react";

const PROBLEMS = [
  "Two Sum",
  "Reverse Linked List",
  "Valid Parentheses",
  "Merge Intervals",
  "LRU Cache",
  "Word Break",
];

const DIFFICULTIES = [
  { value: "easy", color: "border-success text-success" },
  { value: "medium", color: "border-warning text-warning" },
  { value: "hard", color: "border-error text-error" },
];

const CreateSessionModal = ({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) => {
  if (!isOpen) return null;

  const canCreate = roomConfig.problem && roomConfig.difficulty && !isCreating;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-base-100 border border-base-content/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-base-content/10">
          <div>
            <h3 className="text-xl font-bold">Create New Session</h3>
            <p className="text-sm text-base-content/60">Pick a problem and difficulty</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Problem</label>
            <select
              className="select select-bordered w-full"
              value={roomConfig.problem}
              onChange={(e) => setRoomConfig({ ...roomConfig, problem: e.target.value })}
            >
              <option value="">Select a problem</option>
              {PROBLEMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => {
                const active = roomConfig.difficulty === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setRoomConfig({ ...roomConfig, difficulty: d.value })}
                    className={`py-3 rounded-xl border-2 capitalize font-medium transition ${
                      active
                        ? `${d.color} bg-base-200`
                        : "border-base-content/10 text-base-content/70 hover:border-base-content/30"
                    }`}
                  >
                    {d.value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t border-base-content/10 bg-base-200/50">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={onCreateRoom}
            disabled={!canCreate}
            className="btn btn-primary gap-2"
          >
            {isCreating && <Loader2 className="size-4 animate-spin" />}
            {isCreating ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;
