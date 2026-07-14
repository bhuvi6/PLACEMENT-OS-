import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/toast";
import Dashboard from "@/pages/Dashboard";
import DailyTracker from "@/pages/DailyTracker";
import DSATracker from "@/pages/DSATracker";
import JobTracker from "@/pages/JobTracker";
import ResumeVault from "@/pages/ResumeVault";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily" element={<DailyTracker />} />
            <Route path="/dsa" element={<DSATracker />} />
            <Route path="/jobs" element={<JobTracker />} />
            <Route path="/resume" element={<ResumeVault />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ToastProvider>
  );
}
