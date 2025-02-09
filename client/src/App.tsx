import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { AnimatePresence, motion } from "framer-motion";

function Router() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar 
        onCartClick={() => setCartOpen(true)} 
        onSearch={setSearchQuery}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AnimatePresence mode="wait">
        <motion.main 
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute 
              path="/" 
              component={() => <HomePage searchQuery={searchQuery} />}
            />
            <ProtectedRoute path="/profile" component={ProfilePage} />
            <ProtectedRoute path="/admin" component={AdminPage} adminOnly={true} />
            <Route component={NotFound} />
          </Switch>
        </motion.main>
        <Footer />
      </AnimatePresence>
    </div>
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