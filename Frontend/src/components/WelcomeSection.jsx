import { Plus, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const WelcomeSection = ({ onCreateSession }) => {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] || "Developer";

  return (
    <section className="relative overflow-hidden border-b border-base-content/10">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100/60 backdrop-blur border border-base-content/10 text-xs font-medium mb-4">
              <Sparkles className="size-3.5 text-primary" />
              Ready for your next interview
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {name}
              </span>
            </h1>
            <p className="mt-3 text-base-content/70 max-w-xl">
              Practice coding problems with peers in real-time. Create a session, invite a friend,
              and level up together.
            </p>
          </div>

          <button
            onClick={onCreateSession}
            className="btn btn-primary btn-lg shadow-lg shadow-primary/30 gap-2"
          >
            <Plus className="size-5" />
            New Session
          </button>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
