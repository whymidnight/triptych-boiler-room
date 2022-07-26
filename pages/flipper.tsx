import FlippeningPage from "../src/pages/flippening";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useFlipperWasm } from "../src/utils/wasm_loader_hooks";

const XSwap = () => {
  const theme = CreateTheme();
  const flipper = useFlipperWasm();

  return (
    <ThemeProvider theme={theme}>
      {flipper === "ready" && <FlippeningPage />}
    </ThemeProvider>
  );
};

export default XSwap;
