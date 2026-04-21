import { getDifficultyBadgeClass } from "../lib/utils";
import { BookOpen, Lightbulb, ShieldCheck } from "lucide-react";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto bg-base-200/50">
      {/* Header */}
      <div className="p-6 bg-base-100 border-b border-base-content/10">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)} font-semibold`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-sm text-base-content/60">{problem.category}</p>

        <div className="mt-4">
          <select
            className="select select-sm select-bordered w-full"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Description */}
        <div className="rounded-xl bg-base-100 border border-base-content/10 p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
            <BookOpen className="size-4 text-primary" />
            Description
          </h2>
          <div className="space-y-2 text-sm leading-relaxed text-base-content/85">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx}>{note}</p>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="rounded-xl bg-base-100 border border-base-content/10 p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
            <Lightbulb className="size-4 text-secondary" />
            Examples
          </h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-sm badge-primary badge-outline">{idx + 1}</span>
                  <span className="text-sm font-semibold">Example {idx + 1}</span>
                </div>
                <div className="bg-base-200 rounded-lg p-4 font-mono text-xs space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-[60px]">Input:</span>
                    <span className="text-base-content/80">{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-success font-bold min-w-[60px]">Output:</span>
                    <span className="text-base-content/80">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-base-content/10 mt-2">
                      <span className="text-xs text-base-content/60 font-sans">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className="rounded-xl bg-base-100 border border-base-content/10 p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
            <ShieldCheck className="size-4 text-warning" />
            Constraints
          </h2>
          <ul className="space-y-1.5">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <code className="text-xs bg-base-200 px-1.5 py-0.5 rounded">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
