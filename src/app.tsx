import { Box, Grid, Stack } from "@mui/material";
import { Timer } from "./timer";
import Todos from "./todos";

export default function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Stack
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Timer />
            <Todos />
          </Stack>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
}
