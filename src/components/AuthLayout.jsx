import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { BRAND } from "@/lib/shop";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-card lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-foreground lg:block">
        <Image
          src="https://media.base44.com/images/public/6aedeebbaa00a922db56b57c/a5a216851_generated_image.png"
          alt="A handi of chicken biryani"
          fittingType="fill"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/20" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="flex items-center gap-2.5 text-background">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-saffron via-chili to-plum font-display text-sm font-semibold tracking-tight text-primary-foreground">
              SD
            </span>
            <span className="font-display text-[19px] font-medium tracking-tight">{BRAND}</span>
          </Link>
          <div className="max-w-sm text-background">
            <p className="font-display text-[clamp(1.8rem,2.4vw,2.5rem)] leading-[1.15] tracking-[-0.01em]">
              “Cooked by hand this morning, at your door by dinner.”
            </p>
            <p className="mt-4 text-sm text-background/60">
              One home kitchen. A short menu. Delivered by the person who cooked it.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-saffron via-chili to-plum font-display text-xs font-semibold tracking-tight text-primary-foreground">
              SD
            </span>
            <span className="font-display text-[17px] font-medium tracking-tight">{BRAND}</span>
          </Link>

          {Icon && (
            <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <h1 className="font-display text-[clamp(1.9rem,4vw,2.4rem)] leading-tight tracking-[-0.01em] text-foreground">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}