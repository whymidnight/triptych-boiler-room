import { Linktree } from "../components/cards";
import MatrixRain from "../../vendor_modules/matrixrain/src/MatrixRain";
import { Grid } from "@mui/material";

export const Home = () => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Grid
        container
        style={{
          display: "fixed",
          padding: "10%",
          width: "100vw",
        }}
      >
        <Grid item xs={1} sm={4}></Grid>
        <Grid item xs={10} sm={4}>
          <Linktree
            i={3}
            title={"Mint Test Apes"}
            subtitle={"NOT INTERNAL AND CONFIDENTIAL MINTING PAGE!"}
            link={"/mint"}
            cover={"/github.png"}
          />
        </Grid>
        <Grid item xs={1} sm={4}></Grid>
        <Grid item xs={6}>
          <Linktree
            i={3}
            title={"xQuesting"}
            subtitle={"A P2E Staking Game!"}
            link={"/xquesting"}
            cover={"/github.png"}
          />
        </Grid>
        <Grid item xs={6}>
          <Linktree
            i={3}
            title={"xSwap"}
            subtitle={"Swap Utility Tokens for Project Tokens!"}
            link={"/xswap"}
            cover={"/github.png"}
          />
        </Grid>
      </Grid>
      <div style={{ zIndex: -1 }}>
        <MatrixRain />
      </div>
    </div>
  );
};
