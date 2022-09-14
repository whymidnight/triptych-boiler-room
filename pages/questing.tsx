import XQuestingPage from "../src/pages/xquesting";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  useFlipperWasm,
  useSwapperWasm,
  useQuestingWasm,
} from "../src/utils/wasm_loader_hooks";

const XQuesting = () => {
  const theme = CreateTheme();
  const questing = useQuestingWasm();
  const swapper = useSwapperWasm();
  const flipper = useFlipperWasm();

  return (
    <ThemeProvider theme={theme}>
      {questing === "ready" && questing === swapper && swapper === flipper && (
        <XQuestingPage />
      )}
    </ThemeProvider>
  );
};

export default XQuesting;

