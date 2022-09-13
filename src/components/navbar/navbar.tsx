import * as React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Divider, Typography } from "@mui/material";
import styled from "styled-components";
import Theme from "../../utils/theme/theme";
import Image from "next/image";
import Link from "next/link";
import { Grid } from "@mui/material";

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
      <Grid container sx={{ width: "100vw", display: "flex" }}>
        <Grid item style={{ position: "relative" }} xs={4}>
          <Link href="/">
            <a>
              <Image
                src={process.env.NEXT_PUBLIC_LOGO_FILE!}
                width={300}
                layout="fill"
                objectFit="contain"
                alt="logo"
              />
            </a>
          </Link>
        </Grid>

        <Grid item xs={1} />
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "right",
            paddingRight: "1%",
          }}
          xs={7}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "1rem",
            }}
          >
            <Link href="https://solfaucet.com/">
              <a>
                <Typography color="white" variant="h6" fontSize={18}>
                  Faucet
                </Typography>
              </a>
            </Link>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "1rem",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Divider
              sx={{ bgcolor: "#37AA9C" }}
              orientation="vertical"
              flexItem
            />
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "1rem",
            }}
          >
            <Link href="/profile">
              <a>
                <Typography color="white" variant="h6" fontSize={18}>
                  Manage Profile
                </Typography>
              </a>
            </Link>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "1rem",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Divider
              sx={{ bgcolor: "#37AA9C" }}
              orientation="vertical"
              flexItem
            />
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "1rem",
            }}
          >
            <Link href="/giveaways">
              <a>
                <Typography color="white" variant="h6" fontSize={18}>
                  Giveaways
                </Typography>
              </a>
            </Link>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "1rem",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Divider
              sx={{ bgcolor: "#37AA9C" }}
              orientation="vertical"
              flexItem
            />
          </Box>
          <WalletMultiButton />
        </Grid>
      </Grid>
    </TopBar>
  );
};
export default Navbar;
