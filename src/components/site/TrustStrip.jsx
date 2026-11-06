import React from "react";
import { Bike, ShieldCheck, Flame } from "lucide-react";
import { FREE_DELIVERY_OVER, formatPrice } from "@/lib/shop";

const badges = [
  {
    icon: Flame,
    label: "Cooked to order, never reheated",
    tint: "bg-saffron/20",
    ink: "text-chili",
  },
  {
    icon: Bike,
    label: `Free delivery over ${formatPrice(FREE_DELIVERY_OVER)}`,
    tint: "bg-leaf/15",
    ink: "text-leaf",
  },
  {
    icon: ShieldCheck,
    label: "Cash on delivery available",
    tint: "bg-plum/15",
    ink: "text-plum",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-card/70">
      <div className="shell grid gap-3 py-5 sm:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 ${badge.tint}`}
          >
            <badge.icon className={`h-4 w-4 shrink-0 ${badge.ink}`} aria-hidden="true" />
            <span className="text-xs font-semibold text-foreground sm:text-[13px]">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}