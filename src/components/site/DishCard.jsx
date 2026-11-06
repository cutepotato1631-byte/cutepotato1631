import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/shop";

export default function DishCard({ dish }) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const soldOut = dish.available === false;

  const handleAdd = () => {
    add(dish);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={dish.image_url}
          alt={dish.name}
          fittingType="fill"
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            soldOut ? "opacity-50 saturate-0" : ""
          }`}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {(dish.tags || []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-chili shadow-sm backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
        {soldOut && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-background">
              Sold out today
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight tracking-[-0.01em]">{dish.name}</h3>
          <span className="shrink-0 rounded-full bg-chili/10 px-2.5 py-1 text-xs font-bold text-chili">
            {formatPrice(dish.price)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {dish.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-muted-foreground">
            {[dish.serves, dish.prep_time ? `${dish.prep_time} min` : null]
              .filter(Boolean)
              .join(" · ")}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={soldOut}
            className="h-9 rounded-full px-4 text-xs font-semibold"
          >
            {justAdded ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="mr-1 h-3.5 w-3.5" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}