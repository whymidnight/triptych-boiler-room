import React from "react";
import { card as cardInterface } from "./utils/interfaces";
import Card from "./Card";

interface GameBoardProps {
  bankerCards: cardInterface[];
  playerCards: cardInterface[];
  bankerScore: number | string | null;
  playerScore: number | string | null;
}
const GameBoard = ({
  bankerCards,
  playerCards,
  bankerScore,
  playerScore,
}: GameBoardProps): JSX.Element => {
  return (
    <>
      {playerCards.length ? (
        <React.Fragment>
          {bankerCards.map((card, index) => (
            <Card
              image={card.image}
              value={card.value}
              suit={card.suit}
              code={card.code}
            ></Card>
          ))}
          <div className="score-box">
            <span>{bankerScore}</span>
          </div>
          <p>
            Blackjack pays 3 to 2 - &spades; &clubs; &hearts; &diams; - Dealer
            stands on all 17s
          </p>
          {playerCards.map((card, index) => (
            <Card
              image={card.image}
              value={card.value}
              suit={card.suit}
              code={card.code}
            ></Card>
          ))}
          <div className="score-box">
            <span>{playerScore}</span>
          </div>
        </React.Fragment>
      ) : (
        <div className="no-cards-screen-message has-text-centered">
          <h1>Welcome to Blackjack!</h1>
        </div>
      )}
    </>
  );
};

export default GameBoard;

