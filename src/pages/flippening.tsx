import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import { Box } from "@mui/material";
import Flipper from "src/containers/Flipper";
import { StyledCard } from "src/components/cards";

export const FlippeningPage: FC = () => {
  return (
    <>
      <Navbar />
      <div className="xquestingbg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box className="flippening-box">
            <Flipper />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default FlippeningPage;
