import React from "react";
import { ChefHat, Bike, UtensilsCrossed } from "lucide-react";

const steps = [
  {
    icon: UtensilsCrossed,
    title: "Pick your dishes",
    body: "Browse the menu and add what you're craving. Everything is cooked to order, never reheated.",
    tint: "bg-saffron/20",
    ink: "text-chili",
    rule: "bg-saffron",
  },
  {
    icon: ChefHat,
    title: "I cook it fresh",
    body: "Your food is made in small batches in my home kitchen, then packed hot and sealed.",
    tint: "bg-leaf/15",
    ink: "text-leaf",
    rule: "bg-leaf",
  },
  {
    icon: Bike,
    title: "Delivered to you",
    body: "I deliver it myself across the city, so it reaches you within the hour, still steaming.",
    tint: "bg-plum/15",
    ink: "text-plum",
    rule: "bg-plum",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-y border-border bg-gradient-to-b from-secondary/70 to-background py-16 sm:py-24">
      <div className="shell">
        <div className="max-w-xl">
          <p className="eyebrow text-chili">From my kitchen to your table</p>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.1] tracking-[-0.01em]">
            Three steps, one warm meal
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg sm:p-8"
            >
              <span className={`absolute inset-x-0 top-0 h-1.5 ${step.rule}`} aria-hidden="true" />
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${step.tint} ${step.ink}`}
                >
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className={`font-display text-3xl ${step.ink} opacity-30`}>0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-xl leading-snug">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}