import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./auth";
import Shell from "./components/Shell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-muted">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

/**
 * Route guard.
 *
 * Convenience only. Every admin endpoint independently verifies the session
 * server-side and answers 401 without it, so a user who edits their way past
 * this component reaches empty screens, not data.
 */
function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RedirectIfSignedIn() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to="/" replace />;
  return <Login />;
}

function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

// basename keeps every route under /admin/, which is where Apache serves the
// second Vite build from.
export const router = createBrowserRouter(
  [
    {
      element: <Root />,
      children: [
        { path: "/login", element: <RedirectIfSignedIn /> },
        {
          element: <RequireAuth />,
          children: [
            {
              element: <Shell />,
              children: [
                { path: "/", element: <Dashboard /> },
                { path: "/leads", element: <Leads /> },
                { path: "/leads/:id", element: <LeadDetail /> },
                { path: "/reports", element: <Reports /> },
                { path: "/settings", element: <Settings /> },
              ],
            },
          ],
        },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: "/admin" },
);
