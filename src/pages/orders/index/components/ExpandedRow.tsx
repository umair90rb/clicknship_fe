import { useGetOrderQuery } from "@/api/orders";
import Text from "@/components/Text";
import type { Order } from "@/types/order";
import type { MRT_Row, MRT_TableInstance } from "material-react-table";
// import { useEffect } from "react";

export default function ExpandRow({
  row,
}: {
  row: MRT_Row<Order>;
  table: MRT_TableInstance<Order>;
}) {
  const { data, error, isError, isFetching } = useGetOrderQuery(row.id);

  // useEffect(() => {
  //   console.log("mounting");
  //   return () => {
  //     console.log("unmounting");
  //   };
  // }, []);

  if (isFetching) return <Text>Loading...</Text>;
  if (isError) return <Text>{JSON.stringify(error)}</Text>;

  return <Text>Expaned Order {JSON.stringify(data)}</Text>;
}
