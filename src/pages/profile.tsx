import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import Profile from "src/containers/Profile/index";
import { Box } from "@mui/material";

export const ProfilePage: FC = () => {
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
            height: "100vh",
          }}
        >
          <Profile />
        </Box>
      </div>
    </>
  );
};

export default ProfilePage;
