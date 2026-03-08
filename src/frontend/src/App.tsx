import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { Navbar } from "./components/Navbar";
import { RegistrationPage } from "./components/RegistrationPage";
import { useIsCallerAdmin } from "./hooks/useQueries";

type View = "home" | "register" | "admin";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1">
        {currentView === "home" && (
          <LandingPage onNavigate={setCurrentView} isAdmin={!!isAdmin} />
        )}
        {currentView === "register" && <RegistrationPage />}
        {currentView === "admin" && <AdminPanel />}
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
