export const ORDER_STATUSES: { label: string; color: string; value: string }[] =
  [
    { label: "Payment Pending", color: "info", value: "payment pending" },
    { label: "Confirm", color: "success", value: "confirmed" },
    { label: "No Pick", color: "warning", value: "no pick" },
    { label: "Cancel", color: "error", value: "cancel" },
    { label: "Duplicate", color: "inherit", value: "duplicate" },
    { label: "Fake Order", color: "secondary", value: "fake order" },
  ];
