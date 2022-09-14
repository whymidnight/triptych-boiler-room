import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import { XQuesting } from "../containers/xQuesting/index";
import { Box, Button, Typography } from "@mui/material";

export const XQuestingPage: FC = () => {
  return (
    <>
      <Navbar />
      <Box className="xquestingbg">
        <XQuesting />
      </Box>
    </>
  );
};

export default XQuestingPage;
