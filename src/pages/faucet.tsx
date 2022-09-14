import { FC } from "react";
import { Navbar } from "../components/navbar/navbar";
import Faucet from "src/containers/Faucet";
import { Box } from "@mui/material";
import { Connection, PublicKey } from "@solana/web3.js";

export const FaucetPage: FC = () => {
  const network = "devnet";
  const rpcHost = "https://api.devnet.solana.com";
  const connection = new Connection(rpcHost);

  return (
    <>
      <div className="xquestingbg">
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Faucet
            candyMachineId={
              new PublicKey("Qo5Ey1rKsVa7pFNy1DJNHDK8MgPwLWLoRu69cozXkP3")
            }
            network={network}
            rpcHost={rpcHost}
            connection={connection}
          />
        </Box>
      </div>
    </>
  );
};

export default FaucetPage;
