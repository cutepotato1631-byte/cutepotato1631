import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { deliveryFeeFor, formatPrice, FREE_DELIVERY_OVER } from "@/lib/shop";

export default function CartDrawer() {
  const { items, subtotal, count, isOpen, setOpen, setQty, remove, closeCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fee = deliveryFeeFor(subtotal);
  const remaining = Math.max(0, FREE_DELIVERY_OVER - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_OVER) * 100));

  const goToCheckout = () => {
    closeCart();
    navigate(isAuthenticated ? "/checkout" : "/login?returnTo=%2Fcheckout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-display text-2xl">Your basket</SheetTitle>
          <SheetDescription>
            {count === 0 ? "Nothing here yet." : `${count} item${count > 1 ? "s" : ""} from the kitchen`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-xl">Your basket is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a dish from the menu and it will show up here.
              </p>
            </div>
            <Button asChild className="rounded-full" onClick={closeCart}>
              <Link to="/#menu">Browse the menu</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-5 rounded-2xl bg-secondary/70 p-4">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>
                    {remaining > 0
                      ? `Add ${formatPrice(remaining)} for free delivery`
                      : "Free delivery unlocked"}
                  </span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fittingType="fill"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{item.name}</p>
                        <button
                          onClick={() => remove(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-secondary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-secondary"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border bg-card px-6 py-5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-1.5 flex justify-between text-sm text-muted-foreground">
                <span>Delivery</span>
                <span className="font-medium text-foreground">
                  {fee === 0 ? "Free" : formatPrice(fee)}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal + fee)}</span>
              </div>
              <Button className="mt-4 h-12 w-full rounded-full text-sm" onClick={goToCheckout}>
                {isAuthenticated ? "Go to checkout" : "Sign in to order"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Cash on delivery · Confirmed by phone before cooking
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}