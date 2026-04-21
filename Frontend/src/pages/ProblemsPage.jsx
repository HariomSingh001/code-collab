import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { ChevronRight, Code2, Filter } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useState } from "react";

function ProblemsPage() {
  const allProblems = Object.values(PROBLEMS);
  const [filter, setFilter] = useState("all");

  const filteredProblems =
    filter === "all" ? allProblems : allProblems.filter((p) => p.difficulty.toLowerCase() === filter);

  const easyCount = allProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = allProblems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = allProblems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-base-200/40">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Practice Problems</h1>
          <p className="text-base-content/60">Sharpen your coding skills with curated challenges</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: allProblems.length, color: "text-primary", key: "all" },
            { label: "Easy", value: easyCount, color: "text-success", key: "easy" },
            { label: "Medium", value: mediumCount, color: "text-warning", key: "medium" },
            { label: "Hard", value: hardCount, color: "text-error", key: "hard" },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className={`rounded-xl bg-base-100 border p-4 text-left transition-all ${
                filter === stat.key
                  ? "border-primary/50 shadow-md shadow-primary/10"
                  : "border-base-content/5 hover:border-base-content/15"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">{stat.label}</p>
              <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </button>
          ))}
        </div>

        {/* Filter indicator */}
        {filter !== "all" && (
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-4 text-base-content/50" />
            <span className="text-sm text-base-content/60">
              Showing <span className="font-semibold capitalize">{filter}</span> problems
            </span>
            <button onClick={() => setFilter("all")} className="btn btn-ghost btn-xs">
              Clear
            </button>
          </div>
        )}

        {/* Problems list */}
        <div className="space-y-3">
          {filteredProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-base-100 border border-base-content/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-12 rounded-xl bg-primary/10 grid place-items-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Code2 className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold truncate">{problem.title}</h2>
                    <span className={`badge badge-sm ${getDifficultyBadgeClass(problem.difficulty)} font-semibold`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/60">{problem.category}</p>
                  <p className="text-sm text-base-content/50 mt-1 line-clamp-1">
                    {problem.description.text}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-medium text-sm">Solve</span>
                <ChevronRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;
