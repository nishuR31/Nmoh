import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AppLoader } from "@/components/AppLoader";
import { PageLoader } from "@/components/PageLoader";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const Team = lazy(() => import("./pages/Team"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Delay showing the loader to prevent flash on fast loads
    const showTimer = setTimeout(() => {
      if (!isAppReady) {
        setShowLoader(true);
      }
    }, 150);

    // Mark app as ready after initial render
    const readyTimer = setTimeout(() => {
      setIsAppReady(true);
    }, 100);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  useEffect(() => {
    if (isAppReady && showLoader) {
      // Keep loader visible for minimum time once shown
      const hideTimer = setTimeout(() => {
        setShowLoader(false);
      }, 400);
      return () => clearTimeout(hideTimer);
    } else if (isAppReady) {
      setShowLoader(false);
    }
  }, [isAppReady, showLoader]);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AdminProvider>
          <TooltipProvider>
            {/* Dynamic loader - only shows if app takes time to load */}
            {showLoader && !isAppReady && <AppLoader />}
            
            <div className={showLoader && !isAppReady ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route 
                      path="/" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Index />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/products" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Products />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/products/:id" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ProductDetail />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/about" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <About />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/privacy" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Privacy />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/contact" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Contact />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/team" 
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Team />
                        </Suspense>
                      } 
                    />
                  </Route>
                  {/* Admin Routes (no public layout) */}
                  <Route 
                    path="/admin" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminLogin />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <AdminDashboard />
                      </Suspense>
                    } 
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route 
                    path="*" 
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <NotFound />
                      </Suspense>
                    } 
                  />
                </Routes>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AdminProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
