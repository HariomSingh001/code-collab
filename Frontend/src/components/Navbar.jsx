import { Link, useLocation } from "react-router";
import { LayoutDashboard, ListChecks, LogOut, User, Zap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/problems", label: "Problems", icon: ListChecks },
];

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-base-100/70 border-b border-base-content/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="relative size-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent grid place-items-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="text-sm font-black text-primary-content">&lt;/&gt;</span>
            <Zap className="absolute -top-0.5 -right-0.5 size-3 text-warning fill-warning" />
          </div>
          <span className="font-black text-lg tracking-tight">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Code</span><span>st</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-content/5"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200">
            <div className="size-7 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-xs font-bold text-primary-content">
              {user?.email?.[0]?.toUpperCase() || <User className="size-4" />}
            </div>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {user?.email?.split("@")[0] || "User"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="btn btn-ghost btn-sm btn-circle"
            title="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
