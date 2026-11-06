import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { ArrowLeft, Banknote, CheckCircle2, Loader2, Wallet } from "lucide-react";
import {
  AREAS,
  DELIVERY_WINDOWS,
  deliveryFeeFor,
  formatPrice,
  makeOrderNumber,
} from "@/lib/shop";

const payments = [
  { value: "cash", title: "Cash on delivery", body: "Pay the rider when it arrives.", icon: Banknote },
  { value: "transfer", title: "Bank transfer", body: "I'll send details with your confirmation.", icon: Wallet },
];

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    customer_name: user?.full_name || "",
    phone: "",
    area: AREAS[0],
    address: "",
    notes: "",
    delivery_window: DELIVERY_WINDOWS[0],
    payment_method: "cash",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(null);

  const fee = deliveryFeeFor(subtotal);
  const total = subtotal + fee;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.customer_name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Please add your name, phone number and delivery address.");
      return;
    }
    setSubmitting(true);
    try {
      const order = await base44.entities.Order.create({
        order_number: makeOrderNumber(),
        customer_name: form.customer_name.trim(),
        customer_email: user?.email || "",
        phone: form.phone.trim(),
        address: form.address.trim(),
        area: form.area,
        notes: form.notes.trim(),
        delivery_window: form.delivery_window,
        payment_method: form.payment_method,
        items: items.map((item) => ({
          dish_id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image_url: item.image_url,
        })),
        subtotal,
        delivery_fee: fee,
        total,
        status: "pending",
      });
      clear();
      setPlaced(order);
    } catch (err) {
      setError(err.message || "Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="shell flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-lg rounded-[28px] border border-border bg-card p-8 text-center sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
          </span>
          <h1 className="mt-6 font-display text-3xl leading-tight">Order received</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Thanks {placed.customer_name?.split(" ")[0]} — I'll call you on {placed.phone} to
            confirm, then start cooking.
          </p>
          <div className="mt-7 rounded-2xl bg-secondary/70 p-5 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Order</span>
              <span className="font-semibold">{placed.order_number}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{formatPrice(placed.total)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-semibold">
                {placed.payment_method === "cash" ? "Cash on delivery" : "Bank transfer"}
              </span>
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 flex-1 rounded-full">
              <Link to="/orders">Track my order</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 flex-1 rounded-full">
              <Link to="/#menu">Back to menu</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="font-display text-3xl">Your basket is empty</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Add a few dishes from the menu and come back to check out.
        </p>
        <Button asChild className="mt-2 rounded-full">
          <Link to="/#menu">Browse the menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="shell py-10 sm:py-14">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </Link>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight tracking-[-0.01em]">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell me where to bring it — every order is confirmed by phone before cooking starts.
      </p>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={form.customer_name}
                  onChange={(e) => update("customer_name", e.target.value)}
                  placeholder="Your name"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="03xx xxx xxxx"
                  inputMode="tel"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select value={form.area} onValueChange={(value) => update("area", value)}>
                  <SelectTrigger id="area" className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="when">When</Label>
                <Select
                  value={form.delivery_window}
                  onValueChange={(value) => update("delivery_window", value)}
                >
                  <SelectTrigger id="when" className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_WINDOWS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Full address</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="House / flat, street, block, landmark"
                  rows={3}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes for the kitchen (optional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Less spice, no onion, extra chutney…"
                  rows={2}
                  className="rounded-xl"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {payments.map((option) => {
                const active = form.payment_method === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update("payment_method", option.value)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-secondary/60"
                    }`}
                  >
                    <option.icon
                      className={`mt-0.5 h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-sm font-semibold">{option.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {option.body}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {error && (
            <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full text-sm font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing order…
              </>
            ) : (
              `Place order · ${formatPrice(total)}`
            )}
          </Button>
        </form>

        <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fittingType="fill"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.qty}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span className="text-foreground">
                {fee === 0 ? "Free" : formatPrice(fee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}