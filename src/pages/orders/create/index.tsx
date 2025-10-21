import FormToggleButtons from "@/components/form/FormToggleButtons";
import OrderDialog from "./components/dialog";
import { ORDER_STATUSES } from "@/constants/order";

export default function OrderCreate() {
  return (
    <OrderDialog>
      <FormToggleButtons
        onChange={() => {}}
        options={ORDER_STATUSES}
        value="a"
      />
    </OrderDialog>
  );
}
