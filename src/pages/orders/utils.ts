import type { MRT_ColumnFiltersState } from "material-react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const filterTypes: { [key: string]: string } = {
  status: "multi-select",
  totalAmount: "range",
  createdAt: "datetime-range",
};

export function buildFilters(columnFilters: MRT_ColumnFiltersState) {
  console.log("raw filters:", columnFilters);

  const filtered = columnFilters.filter((f) => {
    if (f.value === undefined || f.value === null || f.value === "") {
      return false;
    }

    if (Array.isArray(f.value)) {
      // exclude if empty OR all null/undefined
      return f.value.some((v) => v !== null && v !== undefined && v !== "");
    }

    return true; // allow non-array values like string, number, boolean
  });

  console.log("after filter:", filtered);

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

  console.log("shaped:", shaped);
  return shaped;
}
