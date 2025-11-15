import { Grid } from "@mui/material";
import CreateUpdateRole from "./CreateUpdateRole";

export default function StaffAndPermissions() {
  return (
    <Grid container spacing={1} sx={{ border: "0px solid black" }}>
      <Grid size={{ xs: 12, sm: 8, md: 8 }}></Grid>
      <Grid size={{ xs: 12, sm: 4, md: 4 }} sx={{ border: "0px solid black" }}>
        <CreateUpdateRole />
      </Grid>
    </Grid>
  );
}
