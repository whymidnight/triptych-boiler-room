import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import { XQuesting } from "../containers/xQuesting/index";
import { Box, Button, Typography } from "@mui/material";
import { PublicKey } from "@solana/web3.js";

export const XQuestingPage = ({ oracle }: { oracle: PublicKey }) => {
  return (
    <>
      <Navbar />
      <Box className="xquestingbg">
        <XQuesting oracle={oracle} />
      </Box>
    </>
  );
};

export default XQuestingPage;
