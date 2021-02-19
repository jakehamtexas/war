const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
const ords = new Array(13).fill(null).map((_, i) => i);

const deck = suits.flatMap((suit) => ords.map((ord) => ({ suit, ord })));

const randomSort = () => Math.random() - 0.5;
const shuffled = (deck) => deck.sort(randomSort);

const splitInHalf = (deck) => {
  const half = Math.ceil(deck.length / 2);
  return [deck.slice(0, half), deck.slice(-half)];
};

const hands = () =>
  ([hand1, hand2] = [shuffled, splitInHalf].reduce(
    (memo, fn) => fn(memo),
    deck
  ));

const format = ({ suit, ord }) => {
  const faceCards = {
    0: "Ace",
    10: "Jack",
    11: "Queen",
    12: "King",
  };

  return `${faceCards[ord] || ord + 1} of ${suit}`;
};

const toPlayer = (hand, discard) => ({ hand, discard });

function war(
  { hand: hand1, discard: discard1 = [] },
  { hand: hand2, discard: discard2 = [] },
  spoils = []
) {
  const numCardsPlayer1 = hand1.length + discard1.length;
  const numCardsPlayer2 = hand2.length + discard2.length;

  console.log("Player 1: ", numCardsPlayer1);
  console.log("Player 2: ", numCardsPlayer2);

  const canContinuePlay = numCardsPlayer1 && numCardsPlayer2;
  if (!canContinuePlay) {
    const winningPlayer = numCardsPlayer1 ? 2 : 1;
    console.log(`Game over! Player ${winningPlayer} wins!`);
    return;
  }

  if (!hand1.length && discard1.length) {
    hand1.push(...shuffled(discard1));
    discard1.length = 0;
  }

  if (!hand2.length && discard2.length) {
    hand2.push(...shuffled(discard2));
    discard2.length = 0;
  }

  const next1 = hand1.pop();
  const next2 = hand2.pop();

  console.log(`Player 1: ${format(next1)}, Player 2: ${format(next2)}`);

  spoils.push(next1, next2);
  if (next1.ord > next2.ord) {
    discard1.push(...spoils);
    spoils.length = 0;

    console.log("Player 1 wins this round!");
    console.log("");

    const player1 = toPlayer(hand1, discard1);
    const player2 = toPlayer(hand2, discard2);

    war(player1, player2);
  } else if (next1.ord < next2.ord) {
    discard2.push(...spoils);
    spoils.length = 0;

    console.log("Player 2 wins this round!");
    console.log("");

    const player1 = toPlayer(hand1, discard1);
    const player2 = toPlayer(hand2, discard2);

    war(player1, player2);
  } else {
    console.log("WAR!");
    console.log("");
    if (!hand1.length && discard1.length) {
      hand1.push(...shuffled(discard1));
      discard1.length = 0;
    }

    if (!hand2.length && discard2.length) {
      hand2.push(...shuffled(discard2));
      discard2.length = 0;
    }
    const burn1 = hand1.pop();
    const burn2 = hand2.pop();

    if (!burn1 || !burn2) {
      const winningPlayer = burn2 ? 2 : 1;
      console.log(`Game over! Player ${winningPlayer} wins!`);
      return;
    }

    spoils.push(burn1, burn2);

    const player1 = toPlayer(hand1, discard1);
    const player2 = toPlayer(hand2, discard2);

    war(player1, player2, spoils);
  }
}

const playWar = () => {
  const [hand1, hand2] = hands();
  war({ hand: hand1 }, { hand: hand2 });
};

new Array(10).fill(null).forEach(playWar);
