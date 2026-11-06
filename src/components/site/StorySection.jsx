import React from "react";
import { Image } from "@/components/ui/image";
import { HeartHandshake } from "lucide-react";

const facts = [
  { value: "Every morning", label: "Masalas ground fresh" },
  { value: "One kitchen", label: "No central commissary" },
  { value: "Zero", label: "Preservatives, ever" },
];

export default function StorySection() {
  return (
    <section id="story" className="relative overflow-hidden bg-foreground py-16 text-background sm:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-br from-chili/45 via-foreground to-plum/45"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-saffron/25 blur-3xl"
        aria-hidden="true"
      />
      <div className="shell relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-background/10 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="https://media.base44.com/images/public/6aedeebbaa00a922db56b57c/e08f0def4_generated_image.png"
              alt="Hands plating a freshly cooked curry in the home kitchen"
              fittingType="fill"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-background/15 bg-background/10 p-4 backdrop-blur-md sm:left-8 sm:right-auto sm:max-w-xs">
            <p className="flex items-center gap-2 text-sm font-medium">
              <HeartHandshake className="h-4 w-4 text-saffron" aria-hidden="true" />
              Cooked by the person who delivers it
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-background/60">
            The kitchen
          </p>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] leading-[1.08] tracking-[-0.01em]">
            One pair of hands, not a factory line
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-background/70">
            I cook every dish myself — the biryani is layered in a handi, the nihari
            simmers for hours, and the kebabs are shaped one by one before they hit the
            pan. Nothing is pre-made, nothing sits in a warming tray.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-background/70">
            When your order comes in, I start cooking. When it's ready, I pack it and
            drive it to your door. That's the whole operation — and that's why it tastes
            like someone's home.
          </p>

          <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-background/15 pt-7">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-display text-lg leading-tight">{fact.value}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-background/55">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}