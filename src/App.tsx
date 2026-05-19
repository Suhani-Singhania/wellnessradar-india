import SearchResults from "@/pages/SearchResults";

// Inside your <Routes>:
<Route path="/search" element={<SearchResults />} />
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrendBrief from "./pages/TrendBrief";
import HowItWorks from "./pages/HowItWorks";
import SignalsUniverse from "./pages/SignalsUniverse";
import RegulatoryChecker from "./pages/RegulatoryChecker";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trend/:id" element={<TrendBrief />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/signals" element={<SignalsUniverse />} />
          <Route path="/regulatory" element={<RegulatoryChecker />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
