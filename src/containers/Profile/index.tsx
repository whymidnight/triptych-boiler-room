import { windowOpenPromise } from "@vangware/window-open-promise";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { StyledCard } from "src/components/cards";
import { useMemo, useState, useEffect, useCallback, forwardRef } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { Transaction, Message } from "@solana/web3.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userDataAtom } from "./state/atoms";
import { Manage } from "./containers/Manage";
import { StyledCardSecondary } from "src/components/cards/card";

interface UserData {
  id: string;
  name: string;
  username: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// @ts-ignore
export const Profile = () => {
  const ORACLE = new PublicKey("GbfoTncFrg8PxS2KY9mmCHz73Bv9cXUxsr7Q66y5SUDo");
  const wallet = useWallet();

  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [userData, setUserData] = useRecoilState(userDataAtom);

  const [alertMessage, setAlertMessage] = useState("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onVerify = useCallback(() => {
    if (!wallet.publicKey) return;

    async function auth() {
      const auth = await axios("https://triptychlabs.io:43594/twitter", {
        method: "POST",
        data: {
          method: "authenticate",
          body: {
            publicKey: wallet.publicKey.toString(),
          },
        },
      });

      console.log(auth.data.message);
      setAuth(auth.data.message.valid);
      if (auth.data.message.userData !== null)
        setUserData(auth.data.message.userData.data);
    }
    async function verify() {
      const message = "hello world";
      const signed = await wallet.signMessage(Buffer.from(message));

      const verification = await axios(
        "https://triptychlabs.io:43594/twitter/verify",
        {
          headers: {
            PublicKey: wallet.publicKey.toString(),
            OriginalMessage: message,
          },
          method: "POST",
          data: {
            [message]: Buffer.from(signed).toString("hex"),
          },
        }
      );

      const win = window.open(
        verification.data.message.redirectTo,
        "Authenticate with Twitter",
        "width=400,height=800"
      );
      const timer = setInterval(async () => {
        if (win.closed) {
          clearInterval(timer);
          await auth();
        }
      }, 500);
    }

    verify();
  }, [wallet]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    async function auth() {
      const auth = await axios("https://triptychlabs.io:43594/twitter", {
        method: "POST",
        data: {
          method: "authenticate",
          body: {
            publicKey: wallet.publicKey.toString(),
          },
        },
      });

      console.log(auth.data.message);
      setAuth(auth.data.message.valid);
      if (auth.data.message.userData !== null)
        setUserData(auth.data.message.userData.data);
    }

    auth();
  }, [wallet]);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        sx={{ zIndex: 100000000 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <StyledCard
        className="swap-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Box style={{ padding: "1rem" }}>
          {!auth && (
            <Button variant="outlined" onClick={onVerify}>
              <Typography
                color="#94F3E4"
                fontSize={18}
                variant="h5"
                component="div"
              >
                Connect Twitter
              </Typography>
            </Button>
          )}
          {auth && (
            <Box style={{}}>
              <Box style={{ padding: "1rem" }}>
                <Typography
                  color="#94F3E4"
                  fontSize={18}
                  variant="h5"
                  component="div"
                >
                  Welcome {userData && userData.name}!
                </Typography>
              </Box>
              <Manage />
            </Box>
          )}
        </Box>
      </StyledCard>
    </Grid>
  );
};

export default Profile;
