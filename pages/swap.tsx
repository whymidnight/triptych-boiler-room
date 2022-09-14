import XSwapPage from "../src/pages/xswap";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useSwapperWasm } from "../src/utils/wasm_loader_hooks";

const XSwap = () => {
  const theme = CreateTheme();
  const swapper = useSwapperWasm();

  return (
    <ThemeProvider theme={theme}>
      {swapper === "ready" && <XSwapPage />}
    </ThemeProvider>
  );
};

export default XSwap;
