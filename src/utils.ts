export function getErrorMessage(error: any) {
  if (!error) return "Unknown error";
  return (
    error?.data?.message ||
    error?.error ||
    error?.message ||
    error?.message?.[0] ||
    "Something went wrong"
  );
}
