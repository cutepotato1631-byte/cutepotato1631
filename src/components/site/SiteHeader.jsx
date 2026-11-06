import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { BRAND } from "@/lib/shop";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, LogOut, Menu as MenuIcon, Package, ShoppingBag, X } from "lucide-react";

const links = [
  { label: "Menu", to: "/#menu" },
  { label: "How it works", to: "/#how" },
  { label: "The kitchen", to: "/#story" },
];

export default function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const initial = (user?.full_name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-saffron via-chili to-plum font-display text-sm font-semibold tracking-tight text-primary-foreground shadow-sm">
            SD
          </span>
          <span className="font-display text-[19px] font-medium tracking-tight">{BRAND}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-chili"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            aria-label="Open basket"
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-chili px-1 text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Account menu"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  {initial}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <span className="block truncate text-sm font-semibold">
                    {user?.full_name || "Your account"}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    <Package className="mr-2 h-4 w-4" /> My orders
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/kitchen">
                      <ChefHat className="mr-2 h-4 w-4" /> Kitchen dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] max-w-sm">
              <SheetTitle className="font-display text-2xl">{BRAND}</SheetTitle>
              <div className="mt-8 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-2 py-3 text-lg font-medium transition-colors hover:bg-secondary"
                  >
                    {link.label}
                    <X className="h-4 w-4 rotate-45 text-muted-foreground" aria-hidden="true" />
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Button asChild variant="outline" className="h-12 rounded-full">
                      <Link to="/orders" onClick={() => setMobileOpen(false)}>
                        My orders
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button asChild variant="outline" className="h-12 rounded-full">
                        <Link to="/kitchen" onClick={() => setMobileOpen(false)}>
                          Kitchen dashboard
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button asChild className="h-12 rounded-full">
                      <Link to="/register" onClick={() => setMobileOpen(false)}>
                        Create an account
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-full">
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}