export const BRAND = "SD Brand";
export const TAGLINE = "Home-cooked meals, delivered hot.";

export const AREAS = [
  "DHA",
  "Clifton",
  "Gulshan-e-Iqbal",
  "Bahadurabad",
  "PECHS",
  "North Nazimabad",
  "Saddar",
  "Other area (I'll confirm)",
];

export const CATEGORIES = ["Mains", "Curries", "Grills", "Sides", "Sweets", "Drinks"];

export const DELIVERY_FEE = 149;
export const FREE_DELIVERY_OVER = 3000;

export const DELIVERY_WINDOWS = ["As soon as possible", "Within the hour", "Evening (6–9 pm)"];

export const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString("en-PK")}`;

export const deliveryFeeFor = (subtotal) =>
  subtotal >= FREE_DELIVERY_OVER || subtotal === 0 ? 0 : DELIVERY_FEE;

export const STATUS_FLOW = ["pending", "confirmed", "cooking", "on_the_way", "delivered"];

export const ORDER_STATUS = {
  pending: {
    label: "Waiting for confirmation",
    short: "Pending",
    tone: "bg-amber-100 text-amber-900 border-amber-200",
    step: 0,
  },
  confirmed: {
    label: "Confirmed — starting soon",
    short: "Confirmed",
    tone: "bg-blue-100 text-blue-900 border-blue-200",
    step: 1,
  },
  cooking: {
    label: "Being cooked right now",
    short: "Cooking",
    tone: "bg-purple-100 text-purple-900 border-purple-200",
    step: 2,
  },
  on_the_way: {
    label: "On the way to you",
    short: "On the way",
    tone: "bg-pink-100 text-pink-900 border-pink-200",
    step: 3,
  },
  delivered: {
    label: "Delivered",
    short: "Delivered",
    tone: "bg-emerald-100 text-emerald-900 border-emerald-200",
    step: 4,
  },
  cancelled: {
    label: "Cancelled",
    short: "Cancelled",
    tone: "bg-red-100 text-red-900 border-red-200",
    step: -1,
  },
};

export const NEXT_STATUS = {
  pending: "confirmed",
  confirmed: "cooking",
  cooking: "on_the_way",
  on_the_way: "delivered",
};

export const NEXT_STATUS_LABEL = {
  pending: "Confirm order",
  confirmed: "Start cooking",
  cooking: "Send out for delivery",
  on_the_way: "Mark delivered",
};

export const makeOrderNumber = () =>
  `SD-${Date.now().toString(36).toUpperCase().slice(-5)}`;