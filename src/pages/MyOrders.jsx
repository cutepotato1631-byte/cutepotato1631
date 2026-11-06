import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import OrderTimeline from "@/components/site/OrderTimeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { formatPrice, ORDER_STATUS } from "@/lib/shop";

export default function MyOrders() {
  const { user } = useAuth();
  const { add, openCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    base44.entities.Order.filter({ created_by_id: user.id }, { sort: "-created_date", limit: 50 })
      .then((page) => setOrders(page.items || []))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const reorder = (order) => {
    (order.items || []).forEach((item) => {
      add({
        id: item.dish_id || item.name,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
      });
    });
    openCart();
  };

  return (
    <div className="shell py-10 sm:py-14">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </button>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.01em]">
        My orders
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Everything you've ordered from the kitchen, newest first.
      </p>

      {loading ? (
        <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <p className="font-display text-2xl">No orders yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your first meal is one click away.
          </p>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/#menu">Browse the menu</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => {
            const meta = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
            return (
              <article key={order.id} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-xl">{order.order_number}</h2>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.tone}`}>
                        {meta.short}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(order.created_date).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      · {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.payment_method === "cash" ? "Cash on delivery" : "Bank transfer"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Items</p>
                    <ul className="mt-2 space-y-1 text-sm">
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
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      Delivering to {order.address}, {order.area}
                    </p>
                  </div>
                  <div>
                    <OrderTimeline status={order.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reorder(order)}
                      className="mt-4 h-9 rounded-full"
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Order again
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}