import React from "react";
import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CartDrawer from "@/components/site/CartDrawer";
import { CartProvider } from "@/lib/CartContext";

export default function SiteLayout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}