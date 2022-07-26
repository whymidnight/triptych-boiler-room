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
            paddingTop: "35vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledCard sx={{ width: "50%" }}>
            <Flipper />
          </StyledCard>
        </Box>
      </div>
    </>
  );
};

export default FlippeningPage;
