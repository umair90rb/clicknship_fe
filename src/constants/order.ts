import type { TMuiColors } from "@/types/orders";

export const ORDER_STATUSES: {
  label: string;
  color: TMuiColors,
  value: string;
}[] = [
  { label: "Payment Pending", color: "info", value: "payment pending" },
  { label: "Confirm", color: "success", value: "confirmed" },
  { label: "No Pick", color: "warning", value: "no pick" },
  { label: "Cancel", color: "error", value: "cancel" },
  { label: "Duplicate", color: "inherit", value: "duplicate" },
  { label: "Fake Order", color: "secondary", value: "fake order" },
];


export const OrderStatus = {
  draft: "draft",
  received: "received",
  processed: "processed",
  confirmed: "confirmed",
  fake: "fake order",
  duplicate: "duplicate",
  paymentPending: "payment pending",
  noPick: "no pick",
  cancel: "cancel",
  inBookingQueue: "in booking queue",
  booked: "booked",
  bookingError: "booking error",
};
