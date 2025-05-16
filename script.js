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
const theme = "pokemon";
let hasLaunched = false;
let cardsNodeList;

let difficultySettings = { x: 4, y: 4 };
let numberOfPairs = difficultySettings.x * difficultySettings.y / 2;

let numberOfFounds = 0;
let selectedCard = undefined;
let scoreMultiplier = 10;

let cards = [];
let score = 0;
let moves = 0;

/*---------------Gameplay---------------*/

const incrMoves = () => {
  moves++;
  moveCounter.querySelector(".moves-span").textContent = moves;
};

const incrScore = () => {
  score++;
  currentScore.querySelector("current-score-span").textContent = score;
};

const endGame = () => {
  console.log("ggwp");
};

const endRound = (hasWon, selectedCards) => {
  switch (hasWon) {
    case true:
      selectedCards.forEach(card => card.isFound = true);
      score += 5 * scoreMultiplier;
      numberOfFounds++;
      console.log('win');
      break;
    default:
      if (scoreMultiplier > 1) scoreMultiplier = scoreMultiplier--;
      console.log('lose');
  }
  selectedCard = undefined;
};

const selectCard = (id) => {
  const card = cards.find((card) => !card.isFound && card.id === id);

  if (!card) return;
  else if (!selectedCard) selectedCard = card;
  else if (selectedCard.id !== card.id)
    endRound(selectedCard.pair === card.pair, [selectedCard, card]);

  moves++;
  if (numberOfFounds === numberOfPairs)
    endGame();
};

/*---------------Game-Launcher---------------*/

const resetGame = () => {
  score = 0;
  moves = 0;
  numberOfFounds = 0;
  scoreMultiplier = 10;
  cards = [];
  cardsContainer.innerHTML = "";
  selectedCard = undefined;
  cardsNodeList = undefined;
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
      isFound: false,
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

const listenCards = () => {
  cardsNodeList = document.querySelectorAll(".card");

  cardsNodeList.forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      selectCard(card.id);
    })
  });
}

const launchGame = () => {
  if (hasLaunched) resetGame();
  else hasLaunched = true;
  generateCards(difficultySettings.x, difficultySettings.y);
  printCards();
  listenCards();
};

replayBtn.addEventListener("click", launchGame);

launchGame();
