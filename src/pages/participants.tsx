import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import Giveaways from "src/containers/Giveaways/index";
import { Box } from "@mui/material";

export const ParticipantsPage = ({ tweetId }: { tweetId: string }) => {
  return (
    <>
      <Navbar />
      <div className="xquestingbg">
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "80px",
            paddingBottom: "50px",
          }}
        >
          <Giveaways view="participants" tweetIdSlug={tweetId} />
        </Box>
      </div>
    </>
  );
};

export default ParticipantsPage;
