import * as anchor from "@project-serum/anchor";

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  connection: anchor.web3.Connection,
  queryStatus = false
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let confirmations = 0;
  let done = false;
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  status = await new Promise(async (resolve, reject) => {

    while (!done && queryStatus && confirmations < 40) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
            } else if (status.err) {
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              if (status.confirmationStatus === "finalized") {
                done = true;
                resolve(status);
              }

            }
          }
        } catch (e) {
          if (!done) {
            console.log("REST connection error: txid", txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  done = true;
  console.log("Returning status", status);
  return status;
};

