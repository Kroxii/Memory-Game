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
const cards = [];

/*---------------Game-Launcher---------------*/

const generateCards = (x, y) => {};

const printCards = () => {};

const launchGame = () => {
  // cardsContainer.innerHTML = "";
  generateCards(difficultySettings.x, difficultySettings.y);
  printCards();
};

replayBtn.addEventListener("click", launchGame);
launchGame();

/*---------------Gameplay---------------*/

const selectCard = () => {};

cards.forEach((card) => {
  card.addEventListener("click", selectCard);
});
