
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "@/components/Auth/Login";
import Dashboard from "@/pages/Dashboard";
import Rifas from "@/pages/Rifas";
import BingoEnVivo from "@/pages/BingoEnVivo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center text-white">
          <div className="bg-white text-blue-600 p-4 rounded-full inline-block mb-4 animate-pulse">
            <div className="text-3xl font-bold">B</div>
          </div>
          <h2 className="text-2xl font-bold mb-2">BingoMax</h2>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rifas" element={<Rifas />} />
        <Route path="/bingo-vivo" element={<BingoEnVivo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
