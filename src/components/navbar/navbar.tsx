import * as React from "react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import styled from "styled-components";
import Theme from "../../utils/theme/theme";
import Image from "next/image";
import Link from "next/link";
import {Grid} from "@mui/material";

const TopBar = styled.div`
  z-index: 100000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
`;

export const Navbar = () => {
  return (
    <TopBar id="topbar">
      <Grid container sx={{width: "100vw", display: "flex"}}>
        <Grid item style={{position: "relative"}} xs={4}>
          <Link href="/">
          <Image
            src={process.env.NEXT_PUBLIC_LOGO_FILE!}
            width={300}
            layout="fill"
            objectFit="contain"
            alt="logo"
          />
          </Link>
        </Grid>

        <Grid item xs={2} />
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "right",
            paddingRight: "1%",
          }}
          xs={6}
        >
          <WalletMultiButton />
        </Grid>
      </Grid>
    </TopBar>
  );
};
export default Navbar;
