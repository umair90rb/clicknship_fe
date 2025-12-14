import Input from "@/components/Input";
import Text from "@/components/Text";
import { Grid, Chip, Box } from "@mui/material";
import { useState } from "react";

const PAY_VIA = {
  card: "Credit or Debit Card",
  jazzcash: "Jazz Cash",
  easypaisa: "Easy Paisa",
  transfer: "Bank Transfer",
};

const amounts = [500, 1000, 1500, 2000, 5000, 7500, 10000, 15000, 20000];

export default function TopUp() {
  const [amount, setAmount] = useState(1000);
  const [payVia, setPayVia] = useState("card");

  return (
    <Grid container sx={{ border: "0px solid" }}>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 6,
          lg: 6,
        }}
      >
        <Text variant="body1" bold>
          Choose or Enter Amount
        </Text>
        <>
          {amounts.map((amount) => (
            <Chip
              clickable
              onClick={() => setAmount(amount)}
              sx={{ m: 0.5 }}
              label={`Rs. ${amount.toLocaleString()}`}
            />
          ))}
        </>

        <Input
          type="number"
          name="amount"
          placeholder="Enter custom amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={
            !amount
              ? "Enter valid amount!"
              : amount < 500
              ? "Amount should be greater then 499"
              : ""
          }
        />
        <Text variant="body1" my={1} bold>
          Choose or payment method
        </Text>

        <Box>
            
        </Box>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 6,
          lg: 6,
        }}
      ></Grid>
    </Grid>
  );
}
