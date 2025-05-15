let difficultySettings = { x: 4, y: 4 };
const numberSpan = document.querySelectorAll(".number-span");
const highestScore = document.getElementById("highest-score");
const settingsBtn = document.getElementById("settings-btn");
const settingsScroll = document.getElementById("settings-scroll");
const themeSettings = document.getElementById("theme-settings");
const gameSettings = document.getElementById("game-settings");
const currentScore = document.getElementById("current-score");
const chrono = document.getElementById("chrono");
const moveCounter = document.getElementById("move-counter");
const cardsContainer = document.getElementById("cards-container");
const replayBtn = document.getElementById("replay-btn");
let cards = [];
const theme = "pokemon";

let hasLaunched = false;
let score = 0;
let moves = 0;
let selectedCard = undefined;

/*---------------Gameplay---------------*/

const selectCard = (cardElement) => {
  // const card = get corresponding card from cards
  switch (selectedCard) {
    case undefined:
      selectedCard = card;
      break;
    case selectedCard.pair === card.pair:
      console.log("win");
      selectedCard = undefined;
      break;
    default:
      console.log("lose");
      selectedCard = undefined;
  }
};

/*---------------Game-Launcher---------------*/

const resetGame = () => {
  score = 0;
  moves = 0;
  selectedCard = undefined;
  cardsContainer.innerHTML = "";
  cards = [];
};

const shuffle = () => {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
};

const generateCards = (x, y) => {
  const totalCards = x * y;
  let paireValue = 0;
  let incr = false;

  for (let i = 0; i < totalCards; i++) {
    if (incr) {
      paireValue++;
      incr = false;
    } else if (i !== 0) {
      incr = true;
    }
    const card = {
      id: `card-${i}`,
      pair: paireValue,
      src: `assets/cards/${theme}/${paireValue + 1}.png`,
    };
    cards.push(card);
  }
  shuffle();
};

const printCards = () => {
  for (let i = 0; i < cards.length; i++) {
    cardsContainer.innerHTML += `<img id="${cards[i].id}" class="card" src="${cards[i].src}">`;
  }
};

const launchGame = () => {
  if (hasLaunched) resetGame();
  else hasLaunched = true;
  generateCards(difficultySettings.x, difficultySettings.y);
  printCards();
};

replayBtn.addEventListener("click", launchGame);

launchGame();

/*need to listen to HTML object, not the card list*/
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    selectCard(card);
});
});
