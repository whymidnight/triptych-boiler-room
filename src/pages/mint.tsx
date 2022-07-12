import {FC} from "react";
import * as anc from "@project-serum/anchor";
import Mint from "../containers/Mint";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {Navbar} from "../components/navbar/navbar";
import {useWallet} from "@solana/wallet-adapter-react";

export const MintPage: FC = () => {
  const {publicKey} = useWallet();
  const network = "devnet" as WalletAdapterNetwork;
  const rpcHost = "https://api.devnet.solana.com";
  const connection = new anc.web3.Connection(
    rpcHost ? rpcHost : anc.web3.clusterApiUrl("mainnet-beta")
  );

  return (
    <>
      <Navbar />
      {publicKey && (
        <div className="App-header">
          <Mint
            candyMachineId={new anc.web3.PublicKey(
              "BGcbvPi9RSNbrQZhmAYRPwhyryxoRLXSLt6n8QoPfEM1"
            )}
            connection={connection}
            rpcHost={rpcHost}
            network={network}
          />
          <Mint
            candyMachineId={new anc.web3.PublicKey(
              "CRopuXuzNQbb1pQjXGiUJUcrYNrFywDYyn7XUXoizPZj"
            )}
            connection={connection}
            rpcHost={rpcHost}
            network={network}
          />
        </div>
      )}
    </>
  );
};

export default MintPage;
