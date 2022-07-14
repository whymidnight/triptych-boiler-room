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
                            "Hiq5iqME7LtWLhqQGXtkMZixC8PfuzczaLXbkJzRHyPW"
                        )}
                        connection={connection}
                        rpcHost={rpcHost}
                        network={network}
                    />
                    <Mint
                        candyMachineId={new anc.web3.PublicKey(
                            "7ebwtk1oA88HRUq5GYmCAsz8TjASALKyuK2gmGqpt6d3"
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
