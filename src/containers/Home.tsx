import {Linktree} from "../components/cards";
import MatrixRain from "../../vendor_modules/matrixrain/src/MatrixRain";
import {Grid} from "@mui/material";

export const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Grid
        container
        style={{
          display: 'flex',
        }}
      >
        <Grid item xs={1} sm={4}></Grid>
        <Grid
          item
          sx={{
            alignItems: "self-end",
            display: 'flex',
            justifyContent: 'center',
          }}
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
        <Grid item xs={1} sm={2}></Grid>
        <Grid
          item
          sx={{
            alignItems: "self-start",
            display: 'grid',
            justifyContent: 'right',
          }}
          xs={6}
          sm={4}>
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
          sx={{
            alignItems: "self-start",
            display: 'grid',
            justifyContent: 'left',
          }}
          xs={6}
          sm={4}>
          <Linktree
            i={4}
            title={"xSwap"}
            subtitle={"Swap Utility Tokens for Tokens!"}
            link={"/xswap"}
            cover={"/github.png"}
          />
        </Grid>
        <Grid item xs={1} sm={2}></Grid>
      </Grid>
      <div style={{zIndex: -1}}>
        <MatrixRain />
      </div>
    </div>
  );
};
