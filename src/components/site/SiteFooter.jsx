import React from "react";
import { Link } from "react-router-dom";
import { AREAS, BRAND, FREE_DELIVERY_OVER, formatPrice } from "@/lib/shop";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-saffron via-chili to-plum font-display text-sm font-semibold tracking-tight text-primary-foreground">
                SD
              </span>
              <span className="font-display text-[19px] font-medium tracking-tight">{BRAND}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A one-person home kitchen serving slow-cooked classics across the city. Cooked
              to order, delivered by me.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Free delivery on orders over {formatPrice(FREE_DELIVERY_OVER)}.
            </p>
          </div>

          <div>
            <p className="eyebrow">Menu</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/#menu" className="transition-colors hover:text-foreground">This week's dishes</Link></li>
              <li><Link to="/#how" className="transition-colors hover:text-foreground">How delivery works</Link></li>
              <li><Link to="/#story" className="transition-colors hover:text-foreground">About the kitchen</Link></li>
              <li><Link to="/orders" className="transition-colors hover:text-foreground">Track an order</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Delivery area</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {AREAS.slice(0, 4).map((area) => (
                <li key={area}>{area}</li>
              ))}
              <li>+ more on request</li>
            </ul>
            <p className="eyebrow mt-7">Hours</p>
            <p className="mt-3 text-sm text-muted-foreground">Open daily · 11:00 – 23:00</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND}. Cooked with care in Karachi.</p>
          <p>Order online — every order is confirmed by phone before cooking starts.</p>
        </div>
      </div>
    </footer>
  );
}