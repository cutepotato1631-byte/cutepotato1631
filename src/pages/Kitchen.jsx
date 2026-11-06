import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import AddDishDialog from "@/components/kitchen/AddDishDialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "@/components/ui/image";
import { ChefHat, Loader2, Lock, MapPin, Phone, Trash2 } from "lucide-react";
import {
  AREAS,
  formatPrice,
  NEXT_STATUS,
  NEXT_STATUS_LABEL,
  ORDER_STATUS,
} from "@/lib/shop";

const STATUS_TABS = ["active", "pending", "cooking", "delivered", "cancelled"];

export default function Kitchen() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      base44.entities.Order.list({ sort: "-created_date", limit: 100 }),
      base44.entities.Dish.list({ sort: "sort_order", limit: 100 }),
    ])
      .then(([orderPage, dishPage]) => {
        setOrders(orderPage.items || []);
        setDishes(dishPage.items || []);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const visibleOrders = useMemo(() => {
    if (filter === "active") {
      return orders.filter((order) => ["pending", "confirmed", "cooking", "on_the_way"].includes(order.status));
    }
    if (filter === "cooking") {
      return orders.filter((order) => ["confirmed", "cooking", "on_the_way"].includes(order.status));
    }
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const advanceOrder = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setOrders((prev) =>
      prev.map((item) => (item.id === order.id ? { ...item, status: next } : item))
    );
    await base44.entities.Order.update(order.id, { status: next });
  };

  const cancelOrder = async (order) => {
    setOrders((prev) =>
      prev.map((item) => (item.id === order.id ? { ...item, status: "cancelled" } : item))
    );
    await base44.entities.Order.update(order.id, { status: "cancelled" });
  };

  const toggleDish = async (dish, field, value) => {
    setDishes((prev) =>
      prev.map((item) => (item.id === dish.id ? { ...item, [field]: value } : item))
    );
    await base44.entities.Dish.update(dish.id, { [field]: value });
  };

  const removeDish = async (dish) => {
    if (!window.confirm(`Remove ${dish.name} from the menu?`)) return;
    setDishes((prev) => prev.filter((item) => item.id !== dish.id));
    await base44.entities.Dish.delete(dish.id);
  };

  if (!isAdmin) {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </span>
        <h1 className="font-display text-3xl">Owner access only</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The kitchen dashboard is where orders are confirmed and the menu is managed. Ask the
          app owner to make your account an admin.
        </p>
      </div>
    );
  }

  const activeCount = orders.filter((order) =>
    ["pending", "confirmed", "cooking", "on_the_way"].includes(order.status)
  ).length;

  return (
    <div className="shell py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Kitchen dashboard</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.01em]">
            Today's kitchen
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeCount} order{activeCount === 1 ? "" : "s"} to cook · {dishes.length} dishes on
            the menu
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading the kitchen…
        </div>
      ) : (
        <Tabs defaultValue="orders" className="mt-8">
          <TabsList className="h-11 rounded-full bg-secondary p-1">
            <TabsTrigger value="orders" className="rounded-full px-5 text-sm">
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-full px-5 text-sm">
              Menu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`h-9 rounded-full border px-4 text-sm font-medium capitalize transition-colors ${
                    filter === tab
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {visibleOrders.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
                <ChefHat className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-3 font-display text-xl">Nothing here right now</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  New orders will appear the moment they're placed.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {visibleOrders.map((order) => {
                  const meta = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                  return (
                    <article key={order.id} className="rounded-3xl border border-border bg-card p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-display text-xl">{order.order_number}</h2>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.tone}`}>
                              {meta.short}
                            </span>
                            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium">
                              {order.payment_method === "cash" ? "Cash" : "Transfer"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(order.created_date).toLocaleString("en-PK", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}{" "}
                            · {order.delivery_window}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="text-sm">
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" /> {order.phone}
                          </p>
                          <p className="mt-1 flex items-start gap-1.5 text-muted-foreground">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>
                              {order.address}, {order.area}
                            </span>
                          </p>
                          {order.notes && (
                            <p className="mt-2 rounded-lg bg-secondary/70 px-3 py-2 text-xs text-foreground">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>
                        <ul className="space-y-1 text-sm">
                          {(order.items || []).map((item, index) => (
                            <li key={`${order.id}-${index}`} className="flex justify-between gap-3">
                              <span>
                                {item.qty}× {item.name}
                              </span>
                              <span className="text-muted-foreground">
                                {formatPrice(item.price * item.qty)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {NEXT_STATUS[order.status] && (
                          <Button
                            size="sm"
                            onClick={() => advanceOrder(order)}
                            className="h-9 rounded-full"
                          >
                            {NEXT_STATUS_LABEL[order.status]}
                          </Button>
                        )}
                        {["pending", "confirmed"].includes(order.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelOrder(order)}
                            className="h-9 rounded-full text-destructive"
                          >
                            Cancel order
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Switch a dish off to show it as sold out on the site.
              </p>
              <AddDishDialog onCreated={(dish) => setDishes((prev) => [...prev, dish])} />
            </div>

            <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              {dishes.map((dish) => (
                <div key={dish.id} className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fittingType="fill"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{dish.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dish.category} · {formatPrice(dish.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      Available
                      <Switch
                        checked={dish.available !== false}
                        onCheckedChange={(value) => toggleDish(dish, "available", value)}
                      />
                    </label>
                    <button
                      onClick={() => removeDish(dish)}
                      aria-label={`Remove ${dish.name}`}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Delivering to: {AREAS.slice(0, 4).join(", ")} and more on request.
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}