import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import B2BDashboard from "./pages/B2BDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import EWA from "./pages/EWA";
import Offers from "./pages/Offers";
import Blog from "./pages/Blog";
import Notifications from "./pages/Notifications";
import NotificationSettings from "./pages/NotificationSettings";
import Reports from "./pages/Reports";
import AdminDashboard from "./pages/AdminDashboard";
import Achievements from "./pages/Achievements";
import Leaderboard from "./pages/Leaderboard";
import Profile from '@/pages/Profile';
import Referrals from '@/pages/Referrals';
import Analytics from '@/pages/Analytics';
import DepartmentComparison from '@/pages/DepartmentComparison';
import DepartmentDetail from '@/pages/DepartmentDetail';
import AdminLeads from '@/pages/AdminLeads';
import InvestorHub from '@/pages/InvestorHub';
import CEOHandbook from '@/pages/CEOHandbook';
import DemoEmpleado from '@/pages/DemoEmpleado';
import DemoEmpresa from '@/pages/DemoEmpresa';
import DemoComercio from '@/pages/DemoComercio';
import Demos from '@/pages/Demos';
import AnalyticsAdmin from '@/pages/AnalyticsAdmin';
import AlertsConfig from '@/pages/AlertsConfig';
import ExecutiveDashboard from '@/pages/ExecutiveDashboard';
import AlertThresholdsConfig from '@/pages/AlertThresholdsConfig';
import { CommandPalette, useCommandPalette } from "./components/CommandPalette";
import { PageTransition } from "./components/PageTransition";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import { OfflineBanner } from "./components/OfflineBanner";
import { SyncIndicator } from "./components/SyncIndicator";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/old-landing"} component={Landing} />
      <Route path={"/dashboard/employee"} component={EmployeeDashboard} />
      <Route path={"/dashboard/b2b"} component={B2BDashboard} />
      <Route path={"/dashboard/merchant"} component={MerchantDashboard} />
      <Route path={"/ewa"} component={EWA} />
      <Route path={"/offers"} component={Offers} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/settings/notifications"} component={NotificationSettings} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/dashboard/admin"} component={AdminDashboard} />
      <Route path={"/dashboard/analytics"} component={AnalyticsAdmin} />
      <Route path={"/dashboard/alerts"} component={AlertsConfig} />
      <Route path={"/dashboard/executive"} component={ExecutiveDashboard} />
      <Route path={"/dashboard/alert-thresholds"} component={AlertThresholdsConfig} />
      <Route path={"/achievements"} component={Achievements} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/profile"} component={Profile} />
      <Route path="/profile/:userId" component={Profile} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/departments" component={DepartmentComparison} />
      <Route path="/departments/:id" component={DepartmentDetail} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/investor-hub" component={InvestorHub} />
      <Route path="/ceo-handbook" component={CEOHandbook} />
      <Route path="/demo/empleado" component={DemoEmpleado} />
      <Route path="/demo/empresa" component={DemoEmpresa} />
      <Route path="/demo/comercio" component={DemoComercio} />
      <Route path="/demos" component={Demos} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { open, setOpen } = useCommandPalette();

  return (
    <>
      <CommandPalette open={open} onOpenChange={setOpen} />
      <Toaster />
      <PageTransition>
        <Router />
      </PageTransition>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <UserPreferencesProvider>
          <TooltipProvider>
            <AppContent />
            <OfflineBanner />
            <SyncIndicator />
          </TooltipProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
