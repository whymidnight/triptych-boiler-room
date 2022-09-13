import { RecoilRoot } from "recoil";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletContext,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { TriptychLabsWalletAdapter } from "@solana/wallet-adapter-triptychlabs";
import { clusterApiUrl } from "@solana/web3.js";
import { AppProps } from "next/app";
import { FC, useMemo } from "react";
import { GlobalStyle } from "../src/utils/styleKit";

import "abort-controller/polyfill";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");
require("../styles/wallet_adapter.css");
// require("../vendor_modules/linkees/src/css/components.css");

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new TriptychLabsWalletAdapter()],
    [network]
  );

  return (
    <RecoilRoot>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <GlobalStyle />
            {
              //@ts-ignore
              <Component {...pageProps} />
            }
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </RecoilRoot>
  );
};

export default App;
