import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ui/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Carga inmediata — la home siempre se necesita
import Index from "./pages/Index";

// Carga diferida — solo cuando el usuario navega a esa página
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-brand-magenta border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm font-body animate-pulse">Cargando...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/propiedad/:id" element={<PropertyDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/silvina-privado-gestion"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;