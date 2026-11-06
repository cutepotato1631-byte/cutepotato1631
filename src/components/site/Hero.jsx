import React from "react";
import { Image } from "@/components/ui/image";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { formatPrice, FREE_DELIVERY_OVER } from "@/lib/shop";

const photos = [
  {
    src: "https://media.base44.com/images/public/6aedeebbaa00a922db56b57c/a5a216851_generated_image.png",
    alt: "Chicken dum biryani in a cast-iron handi",
  },
  {
    src: "https://media.base44.com/images/public/6aedeebbaa00a922db56b57c/bbbec6fed_generated_image.png",
    alt: "Chicken karahi in a black iron pan",
  },
  {
    src: "https://media.base44.com/images/public/6aedeebbaa00a922db56b57c/244bc4dde_generated_image.png",
    alt: "Chapli kebabs on a ceramic platter",
  },
];

export default function Hero() {
  return (
    <section
      aria-label="Intro"
      className="relative overflow-hidden bg-gradient-to-b from-saffron/25 via-secondary/60 to-background"
    >
      <div
        className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-chili/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 top-28 h-80 w-80 rounded-full bg-leaf/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-plum/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="shell relative pt-12 sm:pt-20">
        <div className="flex flex-col items-center text-center">
          <span
            className="animate-rise inline-flex items-center gap-2 rounded-full border border-chili/25 bg-chili/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-chili"
            style={{ animationDelay: "40ms" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Home kitchen · Karachi
          </span>

          <h1
            className="animate-rise mx-auto mt-6 max-w-[20ch] font-display text-[clamp(2.5rem,6.4vw,4.4rem)] font-normal leading-[1.04] tracking-[-0.02em] text-foreground sm:max-w-3xl"
            style={{ animationDelay: "120ms" }}
          >
            Slow-cooked classics,{" "}
            <em className="bg-gradient-to-r from-saffron via-chili to-plum bg-clip-text italic text-transparent">
              delivered hot
            </em>{" "}
            to your door
          </h1>

          <p
            className="animate-rise mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground"
            style={{ animationDelay: "220ms" }}
          >
            Small-batch biryani, nihari and karahi — cooked by hand in my home kitchen
            every morning, sealed while it steams, and delivered the same afternoon.
          </p>

          <div
            className="animate-rise mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href="#menu"
              className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-chili via-primary to-plum px-7 text-sm font-semibold text-primary-foreground shadow-md shadow-chili/25 transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Order now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#how"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto"
            >
              How delivery works
            </a>
          </div>

          <div
            className="animate-rise mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
            style={{ animationDelay: "380ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
              Loved by 380+ neighbourhood orders
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
            <span>Free delivery over {formatPrice(FREE_DELIVERY_OVER)}</span>
          </div>
        </div>

        <div
          className="animate-rise relative mt-12 h-[220px] overflow-hidden sm:mt-16 sm:h-[380px]"
          style={{ animationDelay: "460ms" }}
        >
          <div className="grid h-full grid-cols-3 gap-3 sm:gap-5">
            {photos.map((photo, index) => (
              <div key={photo.src} className={index === 1 ? "translate-y-6 sm:translate-y-12" : ""}>
                <div className="relative h-[calc(100%+120px)] overflow-hidden rounded-t-[22px] bg-muted sm:rounded-t-[30px]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fittingType="fill"
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}