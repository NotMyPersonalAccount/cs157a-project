import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "../components/Home/Navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Layout() {
  const { loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-black text-white text-2xl">Loading...</div>;
  }
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Outlet />
      </div>
    </>
  );
}

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </QueryClientProvider>
  ),
});