import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/context/cart-context";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import EventsPage from "@/pages/events-page";
import EventDetailsPage from "@/pages/event-details-page";
import OrderHistoryPage from "@/pages/order-history-page";
import DashboardPage from "@/pages/admin/dashboard-page";
import AdminEventsPage from "@/pages/admin/events-page";
import AdminMenusPage from "@/pages/admin/menus-page";
import AdminUsersPage from "@/pages/admin/users-page";
import AdminOrdersPage from "@/pages/admin/orders-page";
import MasterPage from "@/pages/admin/master-page"; // Import the MasterPage component

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailsPage} />
      <ProtectedRoute path="/orders" component={OrderHistoryPage} />
      <ProtectedRoute path="/admin/dashboard" component={DashboardPage} requireAdmin />
      <ProtectedRoute path="/admin/events" component={AdminEventsPage} requireAdmin />
      <ProtectedRoute path="/admin/menus" component={AdminMenusPage} requireAdmin />
      <ProtectedRoute path="/admin/users" component={AdminUsersPage} requireAdmin />
      <ProtectedRoute path="/admin/orders" component={AdminOrdersPage} requireAdmin />
      <ProtectedRoute path="/admin/master" component={MasterPage} requireAdmin /> {/* Added MasterPage route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;