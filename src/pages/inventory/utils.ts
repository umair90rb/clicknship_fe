import type { MRT_ColumnFiltersState } from "material-react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const filterTypes: { [key: string]: string } = {
  status: "multi-select",
  quantity: "range",
  reservedQuantity: "range",
  reorderPoint: "range",
  costPrice: "range",
  unitCost: "range",
  totalAmount: "range",
  createdAt: "datetime-range",
  updatedAt: "datetime-range",
  initiatedAt: "datetime-range",
  orderDate: "datetime-range",
  expectedDate: "datetime-range",
};

export function buildInventoryFilters(columnFilters: MRT_ColumnFiltersState) {
  const filtered = columnFilters.filter((f) => {
    if (f.value === undefined || f.value === null || f.value === "") {
      return false;
    }

    if (Array.isArray(f.value)) {
      return f.value.some((v) => v !== null && v !== undefined && v !== "");
    }

    return true;
  });

  const shaped = filtered.reduce((pv, cv) => {
    const type = filterTypes[cv.id];
    const value = cv.value;

    if (Array.isArray(value)) {
      if (type === "multi-select") return { ...pv, [cv.id]: value };
      if (type === "datetime-range") {
        const [min, max] = value;
        return {
          ...pv,
          [cv.id]: {
            ...(min ? { min: dayjs(min).utc().toISOString() } : {}),
            ...(max ? { max: dayjs(max).utc().toISOString() } : {}),
          },
        };
      }
      if (type === "range") {
        const [min, max] = value;
        return {
          ...pv,
          [cv.id]: { ...(min ? { min } : {}), ...(max ? { max } : {}) },
        };
      }
    }

    return { ...pv, [cv.id]: value };
  }, {});
  return shaped;
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return `Rs ${value.toLocaleString()}`;
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "-";
  return dayjs(date).format("DD MMM YYYY");
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return "-";
  return dayjs(date).format("DD MMM YYYY HH:mm");
}
