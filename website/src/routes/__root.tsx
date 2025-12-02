import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "../components/Home/Navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <div className="pt-20">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}