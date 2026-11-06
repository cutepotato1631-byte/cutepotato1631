import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import DishCard from "@/components/site/DishCard";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/shop";
import { Search } from "lucide-react";

export default function MenuSection() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    base44.entities.Dish.list({ sort: "sort_order", limit: 100 })
      .then((page) => {
        if (alive) setDishes(page.items || []);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const tabs = useMemo(() => {
    const present = CATEGORIES.filter((cat) => dishes.some((dish) => dish.category === cat));
    return ["All", ...present];
  }, [dishes]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter((dish) => {
      const matchesCategory = category === "All" || dish.category === category;
      const matchesQuery =
        !q ||
        dish.name?.toLowerCase().includes(q) ||
        dish.description?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [dishes, category, query]);

  return (
    <section id="menu" className="py-16 sm:py-24">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-chili">This week's menu</p>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.08] tracking-[-0.01em]">
              Cooked today, for you
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A small menu, done properly. Everything is made to order — if something is
              sold out, it means today's batch is already gone.
            </p>
          </div>
          <label className="relative w-full sm:w-64">
            <span className="sr-only">Search the menu</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dishes"
              className="h-11 rounded-full bg-card pl-11 focus-visible:ring-chili"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = category === tab;
            return (
              <button
                key={tab}
                onClick={() => setCategory(tab)}
                className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-chili bg-chili text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-3xl border border-border bg-card">
                <div className="aspect-[4/3] bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-8 w-20 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
            <p className="font-display text-xl">No dishes match that</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another category, or clear your search.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}