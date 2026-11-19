import { useStickyState } from "hooks";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Add from "modules/stock/Add";
import Remove from "modules/stock/Remove";
import Consult from "modules/stock/Consult";
import AddToCart from "modules/stock/AddToCart";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

export default function Stock() {
  const [tab, setTab] = useStickyState("add", "tab");

  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={3}
      >
        <Grid item xs={12} md={5}>
          <Typography variant="h3">Stock</Typography>
        </Grid>

        <Grid item xs={12} md={7} style={{ textAlign: "right" }}>
          <ToggleButtonGroup
            value={tab}
            exclusive
            onChange={(e, tab) => setTab(tab)}
          >
            <ToggleButton value="consult">Consultar</ToggleButton>
            <ToggleButton value="add">Agregar</ToggleButton>
            <ToggleButton value="remove">Reducir</ToggleButton>
            <ToggleButton value="cart">Agregar a carrito</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Paper /* className={classes.paper} */>
        {tab === "add" && <Add />}
        {tab === "consult" && <Consult />}
        {tab === "remove" && <Remove />}
        {tab === "cart" && <AddToCart />}
      </Paper>
    </Container>
  );
}
