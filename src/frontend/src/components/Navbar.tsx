import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Footprints, Loader2, LogIn, LogOut, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

type View = "home" | "register" | "admin";

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { login, clear, loginStatus, identity, isLoggingIn } =
    useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsCallerAdmin();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        login();
      } catch (err: unknown) {
        const error = err as Error;
        if (error?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Footprints className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            OneStep Jobs
          </span>
        </motion.button>

        {/* Nav links + auth */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-1"
        >
          <nav className="flex items-center gap-1 mr-3">
            <button
              type="button"
              data-ocid="nav.register_link"
              onClick={() => onNavigate("register")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "register"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              Apply
            </button>
            {isAdmin && (
              <button
                type="button"
                data-ocid="landing.admin_link"
                onClick={() => onNavigate("admin")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "admin"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </nav>

          {isAuthenticated ? (
            <Button
              data-ocid="nav.logout_button"
              variant="outline"
              size="sm"
              onClick={handleAuth}
              className="gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          ) : (
            <Button
              data-ocid="nav.login_button"
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn || loginStatus === "initializing"}
              className="gap-2"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogIn className="w-3.5 h-3.5" />
              )}
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </motion.div>
      </div>
    </header>
  );
}
