import React from "react";
import { Check } from "lucide-react";
import { ORDER_STATUS, STATUS_FLOW } from "@/lib/shop";

export default function OrderTimeline({ status }) {
  const meta = ORDER_STATUS[status] || ORDER_STATUS.pending;

  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
        This order was cancelled.
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium">{meta.label}</p>
      <ol className="mt-4 flex items-center">
        {STATUS_FLOW.map((step, index) => {
          const done = index <= meta.step;
          return (
            <li key={step} className="flex flex-1 items-center last:flex-none">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              {index < STATUS_FLOW.length - 1 && (
                <span
                  className={`mx-1 h-px flex-1 ${index < meta.step ? "bg-primary" : "bg-border"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        <span>Placed</span>
        <span>Delivered</span>
      </div>
    </div>
  );
}