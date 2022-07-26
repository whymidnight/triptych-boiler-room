import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import { XSwap } from "../containers/XSwap";
import { Box } from "@mui/material";

export const XSwapPage: FC = () => {
  return (
    <>
      <Navbar />
      <div className="xquestingbg">
        <Box
          sx={{
            paddingTop: "35vh",
          }}
        >
          <XSwap />
        </Box>
      </div>
    </>
  );
};

export default XSwapPage;
