import FlippeningPage from "../src/pages/flippening";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useFlipperWasm, useEscrowWasm } from "../src/utils/wasm_loader_hooks";

const XSwap = () => {
  const theme = CreateTheme();
  const flipper = useFlipperWasm();
  const escrow = useEscrowWasm();

  return (
    <ThemeProvider theme={theme}>
      {flipper === "ready" && flipper === escrow && <FlippeningPage />}
    </ThemeProvider>
  );
};

export default XSwap;

