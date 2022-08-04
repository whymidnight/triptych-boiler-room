import { useEffect, useState } from "react";
import pako from "pako";

export const useSomeplaceWasm = () => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState("loading");
  useEffect(
    () => {
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        // @ts-ignore
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          return await WebAssembly.instantiate(resp, importObject);
        };
      }
      // @ts-ignore
      const go = new Go();
      // @ts-ignore
      let mod, inst;
      async function goInit() {
        try {
          const bytes = await fetch("/someplace.wasm");
          const result = await WebAssembly.instantiateStreaming(
            bytes,
            go.importObject
          );
          mod = result.module;
          inst = result.instance;
          go.run(inst);
          setStatus("ready");
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      }

      goInit();
    },
    [] // Only re-run effect if script src changes
  );
  return status;
};

export const useQuestingWasm = () => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState("loading");
  useEffect(
    () => {
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        // @ts-ignore
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          return await WebAssembly.instantiate(resp, importObject);
        };
      }
      // @ts-ignore
      const go = new Go();
      // @ts-ignore
      let mod, inst;
      async function goInit() {
        try {
          // const bytes = await fetch("/questing.wasm");
          let bytes = pako.ungzip(
            await (await fetch("/questing.wasm.gz")).arrayBuffer()
          );
          // A fetched response might be decompressed twice on Firefox.
          // See https://bugzilla.mozilla.org/show_bug.cgi?id=610679
          if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
            bytes = pako.ungzip(bytes);
          }

          const result = await WebAssembly.instantiate(
            //@ts-ignore
            bytes,
            go.importObject
          );
          mod = result.module;
          inst = result.instance;
          go.run(inst);
          setStatus("ready");
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      }

      goInit();
    },
    [] // Only re-run effect if script src changes
  );
  return status;
};

export const useSwapperWasm = () => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState("loading");
  useEffect(
    () => {
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        // @ts-ignore
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          return await WebAssembly.instantiate(resp, importObject);
        };
      }
      // @ts-ignore
      const go = new Go();
      // @ts-ignore
      let mod, inst;
      async function goInit() {
        try {
          const bytes = await fetch("/swapper.wasm");
          const result = await WebAssembly.instantiateStreaming(
            bytes,
            go.importObject
          );
          mod = result.module;
          inst = result.instance;
          go.run(inst);
          setStatus("ready");
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      }

      goInit();
    },
    [] // Only re-run effect if script src changes
  );
  return status;
};

export const useFlipperWasm = () => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState("loading");
  useEffect(
    () => {
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        // @ts-ignore
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          return await WebAssembly.instantiate(resp, importObject);
        };
      }
      // @ts-ignore
      const go = new Go();
      // @ts-ignore
      let mod, inst;
      async function goInit() {
        try {
          const bytes = await fetch("/flipper.wasm");
          const result = await WebAssembly.instantiateStreaming(
            bytes,
            go.importObject
          );
          mod = result.module;
          inst = result.instance;
          go.run(inst);
          setStatus("ready");
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      }

      goInit();
    },
    [] // Only re-run effect if script src changes
  );
  return status;
};

export const useEscrowWasm = () => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState("loading");
  useEffect(
    () => {
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        // @ts-ignore
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          return await WebAssembly.instantiate(resp, importObject);
        };
      }
      // @ts-ignore
      const go = new Go();
      // @ts-ignore
      let mod, inst;
      async function goInit() {
        try {
          const bytes = await fetch("/escrow.wasm");
          const result = await WebAssembly.instantiateStreaming(
            bytes,
            go.importObject
          );
          mod = result.module;
          inst = result.instance;
          go.run(inst);
          setStatus("ready");
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      }

      goInit();
    },
    [] // Only re-run effect if script src changes
  );
  return status;
};

export const useBlackjackWasm = () => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState("loading");
  useEffect(
    () => {
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        // @ts-ignore
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          return await WebAssembly.instantiate(resp, importObject);
        };
      }
      // @ts-ignore
      const go = new Go();
      // @ts-ignore
      let mod, inst;
      async function goInit() {
        try {
          const bytes = await fetch("/blackjack.wasm");
          const result = await WebAssembly.instantiateStreaming(
            bytes,
            go.importObject
          );
          mod = result.module;
          inst = result.instance;
          go.run(inst);
          setStatus("ready");
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      }

      goInit();
    },
    [] // Only re-run effect if script src changes
  );
  return status;
};
