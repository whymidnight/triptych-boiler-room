import { Box, Button, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";
import { StyledCard } from "src/components/cards";
import Home from "../../vendor_modules/cmui/Home";

// @ts-ignore
export const Faucet = ({ candyMachineId, connection, rpcHost, network }) => {
  const wallet = useWallet();

  const onAirdrop = useCallback(() => {
    if (!wallet.publicKey) return;

    async function airdrop() {
      await connection.requestAirdrop(wallet.publicKey, 1e9);
    }

    airdrop();
  }, [wallet]);

  return (
    <Box
      style={{
        borderRadius: "15px",
        width: "100%",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1.5rem",
        }}
      >
        <Button
          onClick={onAirdrop}
          style={{
            border: "solid",
            borderColor: "#37AA9C",
            borderRadius: "15px",
            padding: "1rem",
            textTransform: "none",
          }}
        >
          <Typography
            color="#37AA9C"
            fontSize={18}
            variant="h5"
            component="div"
          >
            Airdrop ◎2
          </Typography>
        </Button>
      </Box>
      <Home
        candyMachineId={candyMachineId}
        connection={connection}
        txTimeout={6000}
        rpcHost={rpcHost}
        network={network}
      />
    </Box>
  );
};

export default Faucet;
