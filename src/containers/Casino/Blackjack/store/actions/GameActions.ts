import axios from "axios";
import { GameActionTypes, GamePhases } from "../constants";
import { state as storeInterface } from "../store";
import { awaitTransactionSignatureConfirmation } from "src/utils/solana/transaction";
import {ORACLE} from "../../GameScreen";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Transaction, Message } from "@solana/web3.js";
import {WalletContextState} from "@solana/wallet-adapter-react";

declare function start_game(
  oracle: String,
  holder: String,
  amount: String,
  operator: String
): Promise<any>;


/**  CONSTANTS */
const {
  StartHand,
  MakeBet,
  InitialDeal,
  Surrender,
  DoubleDown,
  PlayerDraw,
  PlayerStay,
  BankerDraw,
  EndgameAction,
} = GameActionTypes;
const {
  PreGame,
  BettinStage,
  InitialDraw,
  FirstUserAction,
  UserAction,
  BankerAction,
  Endgame,
  GameEnded,
} = GamePhases;
const base_url: string = "https://deckofcardsapi.com/api";

/** UTILITIES */
const checkPhase = (
  action: string,
  accepted: string[],
  actual: string
): void => {
  if (!accepted.includes(actual)) {
    throw `${actual} is not a valid phase for the action ${action}`;
  }
};

const drawCards = (
  deck_id: string,
  number_of_cards: number = 1,
  baseUrl: string = base_url
) => axios.get(`${baseUrl}/deck/${deck_id}/draw/?count=${number_of_cards}`);

/** ACTIONS */
const startHand = () => async (dispatch, getState) => {
  const {
    game: {
      deck,
      isLastOfDeck,
      current_hand: { phase },
    },
  }: storeInterface = getState();
  checkPhase(StartHand, [PreGame, GameEnded], phase);
  let new_deck: string;
  let new_isLastOfDeck: boolean = isLastOfDeck;
  if (isLastOfDeck) {
    const {
      data: { deck_id },
    } = await axios.get(base_url + "/deck/new/shuffle/?deck_count=6");
    await axios.get(base_url + `/deck/${deck_id}/draw/?count=20`);
    new_deck = deck_id;
    new_isLastOfDeck = false;
  }
  dispatch({
    type: StartHand,
    payload: {
      deck: new_deck || deck,
      isLastOfDeck: new_isLastOfDeck,
      new_phase: BettinStage,
    },
  });
};

const makeBet = (ammount: number) => (dispatch, getState) => {
  const {
    game: {
      current_hand: { phase },
    },
  }: storeInterface = getState();
  checkPhase(StartHand, [BettinStage], phase);
  dispatch({
    type: MakeBet,
    payload: {
      ammount,
      new_phase: InitialDraw,
    },
  });
};

const doInitialDeal = (connection: Connection, wallet: WalletContextState) => async (dispatch, getState) => {
  /*
    Here is where we should incorporate the 
  */

  const {
    game: {
      deck,
      current_hand: { phase, ammountBet },
    },
  }: storeInterface = getState();

  const amountFmt = Math.floor(Number(ammountBet) * LAMPORTS_PER_SOL);
        const selectQuestIx = JSON.parse(
          String.fromCharCode(
            // @ts-ignore
            ...(await start_game(
              ORACLE.toString(),
              wallet.publicKey.toString(),
              String(amountFmt),
              "wallet",
            ))
          )
        );

        console.log(selectQuestIx);
        if (Object.keys(selectQuestIx).length > 0) {
          try {
            const selectQuestTx = Transaction.populate(
              new Message(selectQuestIx.message)
            );
            const recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            selectQuestTx.recentBlockhash = recentBlockhash;

            const logs = await connection.simulateTransaction(await wallet.signTransaction(selectQuestTx));
            console.log(logs.value.logs)

            const signature = await wallet.sendTransaction(
              selectQuestTx,
              connection
            );
            console.log(signature);

            // await connection.confirmTransaction(signature, "finalized");
            await awaitTransactionSignatureConfirmation(
              signature,
              connection,
              true
            );
            // await getEscrow();

          } catch (e) {
          }
        }


  checkPhase(StartHand, [InitialDraw], phase);
  const {
    data: { cards, remaining },
  } = await drawCards(deck, 4);
  dispatch({
    type: InitialDeal,
    payload: {
      newPlayerCards: [cards[1], cards[3]],
      newBankerCards: [cards[2]],
      remaining,
      new_phase: [FirstUserAction, BankerAction, Endgame],
    },
  });
};

const doSurrender = () => (dispatch, getState) => {
  const {
    game: {
      current_hand: { phase },
    },
  }: storeInterface = getState();
  checkPhase(StartHand, [FirstUserAction], phase);
  dispatch({
    type: Surrender,
    payload: { new_phase: GameEnded },
  });
};

const playerDraw =
  (isDoubleDown = false) =>
  async (dispatch, getState) => {
    const {
      game: { deck },
    }: storeInterface = getState();
    const {
      data: { cards, remaining },
    } = await drawCards(deck);
    const phase_base: GamePhases[] = [BankerAction, Endgame];
    dispatch({
      type: isDoubleDown ? DoubleDown : PlayerDraw,
      payload: {
        newCard: cards[0],
        remaining,
        new_phase: isDoubleDown ? phase_base : phase_base.concat(UserAction),
      },
    });
  };

const doPlayerStay = () => (dispatch) => {
  dispatch({ type: PlayerStay, payload: { new_phase: BankerAction } });
};

const bankerDraw = () => async (dispatch, getState) => {

  const {
    game: {
      deck,
      current_hand: { phase },
    },
  }: storeInterface = getState();

  try {
    checkPhase(StartHand, [BankerAction], phase);
  } catch {} // do nothing

  const {
    data: { cards, remaining },
  } = await drawCards(deck);

  dispatch({
    type: BankerDraw,
    payload: {
      newCard: cards[0],
      remaining,
      new_phase: [BankerAction, Endgame],
    },
  });

};

const doEndgame = () => (dispatch) => {
  dispatch({ type: EndgameAction, payload: { new_phases: GameEnded } });
};

export {
  startHand,
  makeBet,
  doInitialDeal,
  doSurrender,
  playerDraw,
  doPlayerStay,
  bankerDraw,
  doEndgame,
};
