import { Box } from "@mui/material";
import { StyledCard } from "src/components/cards";
import Home from "../../vendor_modules/cmui/Home";

// @ts-ignore
export const Faucet = ({ candyMachineId, connection, rpcHost, network }) => {
  return (
    <StyledCard className="swap-container">
      <Home
        candyMachineId={candyMachineId}
        connection={connection}
        txTimeout={6000}
        rpcHost={rpcHost}
        network={network}
      />
    </StyledCard>
  );
};

export default Faucet;
