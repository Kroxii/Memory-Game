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
const cards = document.querySelectorAll(".card");

let hasLaunched = false;
let score = 0;
let moves = 0;
let selectedCard;

/*---------------Gameplay---------------*/

const selectCard = (card) => {
  switch (selectedCard) {
    case undefined:
      selectedCard = card;
      break;
    case selectedCard.pair === card.pair:
      //win
      break;
    default:
      //lose
  }
};

cards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    selectCard(card);
});
});

/*---------------Game-Launcher---------------*/

const resetGame = () => {
  score = 0;
  moves = 0;
  selectedCard = undefined;
  cardsContainer.innerHTML = "";
};

const generateCards = (x, y) => {};

const printCards = () => {};

const launchGame = () => {
  if (hasLaunched) resetGame();
  else hasLaunched = true;
  generateCards(difficultySettings.x, difficultySettings.y);
  printCards();
};

replayBtn.addEventListener("click", launchGame);

launchGame();
