import {Linktree} from "../components/cards";
import MatrixRain from "../../vendor_modules/matrixrain/src/MatrixRain";
import {Grid} from "@mui/material";

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
          paddingTop: "33%",
          width: "100vw",
        }}
      >
        <Grid item xs={1} sm={4}></Grid>
        <Grid
          item
          alignItems="center"
          justifyContent="center"
          xs={10}
          sm={4}>
          <Linktree
            i={3}
            title={"xQuesting"}
            subtitle={"A P2E Staking Game!"}
            link={"/xquesting"}
            cover={"/github.png"}
          />
        </Grid>
        <Grid item xs={1} sm={4}></Grid>
        <Grid
          item
          alignItems="center"
          justifyContent="center"
          xs={6}>
          <Linktree
            i={1}
            title={"Mint"}
            subtitle={"NOT INTERNAL OR CONFIDENTIAL!"}
            link={"/mint"}
            cover={"/github.png"}
          />
        </Grid>
        <Grid
          item
          alignItems="center"
          justifyContent="center"
          xs={6}>
          <Linktree
            i={4}
            title={"xSwap"}
            subtitle={"Swap Utility Tokens for Tokens!"}
            link={"/xswap"}
            cover={"/github.png"}
          />
        </Grid>
      </Grid>
      <div style={{zIndex: -1}}>
        <MatrixRain />
      </div>
    </div>
  );
};
