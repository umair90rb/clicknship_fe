import AdsClickIcon from "@mui/icons-material/AdsClick";
import Text from "./Text";
import { Box, Icon } from "@mui/material";

interface Logo {
  icon: boolean;
}

export default function Logo({ icon = false }) {
  return (
    <Box display={"flex"} gap={1}>
      {icon && (
        <Icon>
          <AdsClickIcon />
        </Icon>
      )}
      <Text
        bold
        variant="h6"
        sx={{ display: { xs: "none", sm: "block" } }}
        text="Click n Ship"
      />
    </Box>
  );
}
