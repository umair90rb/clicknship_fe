import { type MRT_RowData, type MRT_TableOptions } from "material-react-table";

export default function useOrderTable<TData extends MRT_RowData>(): Partial<
  MRT_TableOptions<TData>
> {
  return {};
}
