import { Switch, Route } from "wouter";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import AdminMessages from "@/pages/AdminMessages";
import AdminDb from "@/pages/AdminDb";
import ProjectCaseStudy from "@/pages/ProjectCaseStudy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/projects/:slug" component={ProjectCaseStudy}/>
      <Route path="/admin" component={Admin}/>
      <Route path="/admin/messages" component={AdminMessages}/>
      <Route path="/admin/db" component={AdminDb}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsPageLoading(false);
      return;
    }

    const onLoad = () => setIsPageLoading(false);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AnimatePresence>
            {isPageLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="fixed inset-0 z-[200] bg-background text-foreground flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
