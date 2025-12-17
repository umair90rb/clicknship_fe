import Input from "@/components/Input";
import Text from "@/components/Text";
import { Grid, Chip, Box, Radio } from "@mui/material";
import { useState } from "react";
import cardIconSvg from "@/assets/svg/card.svg";
import masterIconSvg from "@/assets/svg/master.svg";
import visaIconSvg from "@/assets/svg/visa.svg";
import bankTransferIconSvg from "@/assets/svg/bank-transfer.svg";
import easypaisaIconPng from "@/assets/png/easypaisa.svg";
import jazzcashIconPng from "@/assets/png/jazzcash.png";
import PrimaryButton from "@/components/Button";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkButton from "@/components/LinkButton";

interface TPaymentOption {
  label: string;
  logo: any;
  size: number;
  value: string;
  disabled: boolean;
}

const PAYMENT_OPTIONS: TPaymentOption[] = [
  {
    // https://github.com/zfhassaan/alfaPay
    // https://www.bankalfalah.com/digital-banking/ecommerce/
    // https://bankalfalah.gateway.mastercard.com/ma/
    label: "Credit or Debit Card",
    logo: cardIconSvg,
    size: 48,
    value: "card",
    disabled: true,
  },
  {
    // https://sandbox.jazzcash.com.pk/SandboxDocumentation/index.html
    // https://github.com/zfhassaan/jazzcash
    // https://medium.com/@iamsyedalijunaid/jazzcash-credit-debit-card-payment-integration-for-ios-and-android-a-comprehensive-guide-ea63d265d8f8
    // https://www.jazzcash.com.pk/corporate/online-payment-gateway/
    label: "Jazz Cash",
    logo: jazzcashIconPng,
    size: 48,
    value: "jazzcash",
    disabled: true,
  },
  {
    // https://easypay.easypaisa.com.pk/easypay-merchant/faces/pg/site/Login.jsf
    label: "Easy Paisa",
    logo: easypaisaIconPng,
    size: 48,
    value: "easypaisa",
    disabled: true,
  },
  {
    label: "Bank Transfer",
    logo: bankTransferIconSvg,
    size: 48,
    value: "transfer",
    disabled: false,
  },
];

const amounts = [500, 1000, 1500, 2000, 5000, 7500, 10000, 15000, 20000];

const account = {
  no: {
    label: "Account No",
    value: "000001012345678",
  },
  title: {
    label: "Account Title",
    value: "Person Name",
  },
  bank: { label: "Bank Name", value: "Pakistan Bank" },
  iban: { label: "IBAN", value: "PKB1234000001012345678" },
};

function PaymentOption({
  label,
  logo,
  value,
  size,
  disabled,
  checked,
  onClick,
}: TPaymentOption & { checked: boolean; onClick: () => void }) {
  return (
    <Box
      sx={{
        border: "1px solid grey",
        borderRadius: 1,
        my: 1,
        p: 1,
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.dark",
          boxShadow: 3,
        },
      }}
      onClick={!disabled ? onClick : undefined}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <img width={size} height={size} src={logo} />
        <Box sx={{ ml: 1 }}>
          <Text text={label} bold variant="body1" />
          {value === "card" && (
            <>
              <img width={24} height={24} src={visaIconSvg} />
              <img width={24} height={24} src={masterIconSvg} />
            </>
          )}
        </Box>
        {disabled && (
          <Text
            sx={{ ml: 2 }}
            variant="overline"
            bold
            color="success"
            text="Coming soon"
          />
        )}
      </Box>
      <Radio value={value} checked={!disabled && checked} disabled={disabled} />
    </Box>
  );
}

const whatsappLink =
  "https://api.whatsapp.com/send?phone=923001234567&text=I have paid Rs.{amount} through bank transfer. I will send you the payment screenshot for the transaction";

export default function TopUp() {
  const [amount, setAmount] = useState(1000);
  const [paymentOption, setPaymentOption] = useState("transfer");
  const [code, setCode] = useState("");

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
        <Text variant="body1" sx={{ my: 1 }} bold>
          Choose payment method
        </Text>

        {PAYMENT_OPTIONS.map((option) => (
          <PaymentOption
            {...option}
            checked={paymentOption === option.value}
            onClick={() => setPaymentOption(option.value)}
          />
        ))}

        <Box></Box>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
        size={{
          xs: 12,
          sm: 6,
          md: 6,
          lg: 6,
        }}
      >
        <Box
          sx={{
            borderRadius: 1,
            border: "0px solid",
            borderColor: "primary.dark",
            height: 600,
            m: 1,
            p: 1,
          }}
        >
          <Text text="Instruction:" variant="h6" bold />
          <Text
            text={`1. Transfer Rs.${amount} to the account mentioned below`}
          />
          <Text text="2. Take a screenshot of the completed transaction" />
          <Text text="3. Whatsapp the screenshot at 03001234567" />
          <Box
            sx={{
              bgcolor: "lightgrey",
              borderRadius: 1,
              p: 1,
              my: 1,
            }}
          >
            {Object.values(account).map(({ value, label }) => (
              <Text text={`${label}: ${value}`} bold />
            ))}
          </Box>
          <LinkButton
            href={whatsappLink.replace("{amount}", amount.toLocaleString())}
            target="_blank"
            label="Send Screenshot"
            Icon={WhatsAppIcon}
            variant="contained"
            fullWidth
          />
        </Box>
      </Grid>
    </Grid>
  );
}
