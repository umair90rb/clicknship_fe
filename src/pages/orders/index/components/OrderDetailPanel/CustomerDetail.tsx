import PrimaryButton from "@/components/Button";
import Text from "@/components/Text";
import type { Address, Customer } from "@/types/orders/detail";
import { Box, Button, Stack } from "@mui/material";

export default function CustomerDetail({
  customer,
  address,
}: {
  customer: Customer;
  address: Address;
}) {
  return (
    <>
      <Text bold>Customer Detail</Text>
      <Stack spacing={1}>
        {[
          <Text>Name: {customer?.name}</Text>,
          <Text>Email: {customer?.email}</Text>,
          <Text>Phone: {customer?.phone}</Text>,
          <Text>City: {address?.city}</Text>,
          <Text>Country: {address?.country}</Text>,
          <Text>Zip: {address?.zip}</Text>,
          <Text>Address: {address?.address}</Text>,
          <Text>Note: {address?.note}</Text>,
        ].map((row, i) => (
          <Box
            key={i}
            sx={{
              p: 1,
              bgcolor: "grey.300",
            }}
          >
            {row}
          </Box>
        ))}
      </Stack>
      <Box mt={2} />
      <PrimaryButton label="Update Customer Info" onClick={() => {}} />
    </>
  );
}
