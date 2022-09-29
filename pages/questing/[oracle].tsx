import { useRouter } from "next/router";
import XQuestingPage from "../../src/pages/xquesting";
import { CreateTheme } from "../../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  useFlipperWasm,
  useSwapperWasm,
  useQuestingWasm,
} from "../../src/utils/wasm_loader_hooks";
import { PublicKey } from "@solana/web3.js";

const XQuesting = () => {
  const router = useRouter();
  const { oracle } = router.query;

  const theme = CreateTheme();
  const questing = useQuestingWasm();
  const swapper = useSwapperWasm();
  const flipper = useFlipperWasm();

  return (
    <ThemeProvider theme={theme}>
      {questing === "ready" && questing === swapper && swapper === flipper && (
        <XQuestingPage oracle={new PublicKey(oracle)} />
      )}
    </ThemeProvider>
  );
};

export default XQuesting;
