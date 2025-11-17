export function getErrorMessage(error: any) {
  if (!error) return;
  return (
    error?.data?.message ||
    error?.error ||
    error?.message ||
    error?.message?.[0] ||
    "Something went wrong"
  );
}

export function getErrorField(error: string, fields: string[]): "root" {
  for (const field of fields) {
    if (error.includes(field)) {
      return field;
    }
  }
  return "root";
}
