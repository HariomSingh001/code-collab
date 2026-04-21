import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Loader2, Mail, Lock, Sparkles, Zap, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

const Logo = () => (
  <div className="relative size-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent grid place-items-center shadow-2xl shadow-primary/40">
    <span className="text-2xl font-black text-primary-content tracking-tighter">&lt;/&gt;</span>
    <Zap className="absolute -top-1 -right-1 size-4 text-warning fill-warning" />
  </div>
);

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setMode("signup");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-base-300 grid place-items-center p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent blur-lg opacity-60 animate-pulse" />
            <Logo />
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Code</span>
            <span className="text-base-content">st</span>
          </h1>
          <p className="text-sm text-base-content/60 mt-1">Code. Compete. Conquer.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-base-100 border border-base-content/10 shadow-2xl p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <Sparkles className="size-3.5" />
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </div>

          <h2 className="text-2xl font-bold mb-1">
            {mode === "signup" ? "Get started" : "Sign in"}
          </h2>
          <p className="text-sm text-base-content/60 mb-6">
            {mode === "signup"
              ? "Join thousands practicing together"
              : "Continue your interview prep journey"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full shadow-lg shadow-primary/30 gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="divider text-xs text-base-content/50 my-6">OR</div>

          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="text-sm text-center w-full text-base-content/70 hover:text-primary transition-colors"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </div>

        <p className="text-center text-xs text-base-content/50 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
