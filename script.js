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
let numberOfPairs = (difficultySettings.x * difficultySettings.y) / 2;

let numberOfFounds = 0;
let selectedCard = undefined;
let scoreMultiplier = 10;

let cards = [];
let score = 0;
let moves = 0;

/*---------------Chrono---------------*/

const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
let totalSeconds = 0;
let timerStart = false;
let timerInterval = null;

const start = (timer) => {
  return timer.toString().padStart(2, "0");
};

const setTimer = () => {
  totalSeconds++;
  seconds.textContent = start(totalSeconds % 60);
  minutes.textContent = start(Math.floor(totalSeconds / 60));
};

const cardClick = () => {
  if (!timerStart) {
    timerStart = true;
    timerInterval = setInterval(setTimer, 1000);
  }
};

const resetTimer = () => {
  clearInterval(timerInterval);
  timerStart = false;
  totalSeconds = 0;
  seconds.textContent = "00";
  minutes.textContent = "00";
  timerInterval = null;
};

/*---------------Gameplay---------------*/

const endGame = () => {
  console.log("ggwp");
};

const endRound = (hasWon, selectedCards) => {
  switch (hasWon) {
    case true:
      selectedCards.forEach((card) => (card.isFound = true));
      score += 5 * scoreMultiplier;
      numberOfFounds++;
      console.log("win");
      break;
    default:
      if (scoreMultiplier > 1) scoreMultiplier = scoreMultiplier--;
      console.log("lose");
  }
  selectedCard = undefined;
};

const updateGameInfos = () => {
  const scoreSpan = document.getElementById("current-score-span");
  const movesSpan = document.getElementById("moves-span");

  scoreSpan.textContent = score;
  movesSpan.textContent = moves;
};

  // Lance le chrono au tout premier clic
const selectCard = (cardEl) => {
  if (!timerStart) {
    cardClick();
  }

  const card = cards.find((card) => !card.isFound && card.id === cardEl.id);

  if (!card) return;
  else if (!selectedCard) {
    selectedCard = card;
    cardEl.classList.add("flip");
  } else if (selectedCard.id !== card.id) {
    cardEl.classList.add("flip");
    const previousCardEl = document.getElementById(selectedCard.id);
    const isPair = selectedCard.pair === card.pair;
    endRound(isPair, [selectedCard, card]);

    if (!isPair) {
      // Désactive temporairement les clics
      cardsNodeList.forEach(el => el.style.pointerEvents = "none");
      setTimeout(() => {
        cardEl.classList.remove("flip");
        previousCardEl.classList.remove("flip");
        // Réactive les clics
        cardsNodeList.forEach(el => el.style.pointerEvents = "");
      }, 1000); // 1 seconde avant de retourner les cartes
    }
    endRound(selectedCard.pair === card.pair, [selectedCard, card]);
  }

  moves++;
  if (numberOfFounds === numberOfPairs) endGame();
  updateGameInfos();
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
  numberOfPairs = (difficultySettings.x * difficultySettings.y) / 2;
  resetTimer();
  updateGameInfos();
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
    cardsContainer.innerHTML += `
    <div id="${cards[i].id}" class="card">
      <img class="front-face" src="${cards[i].src}">
      <img class="back-face" src="assets/back/back.jpg">
    </div>`;
  }
};

const listenCards = () => {
  cardsNodeList = document.querySelectorAll(".card");

  cardsNodeList.forEach((cardEl) => {
    cardEl.addEventListener("click", (event) => {
      event.preventDefault();
      selectCard(cardEl);
    });
  });
};

const launchGame = () => {
  if (hasLaunched) resetGame();
  else hasLaunched = true;
  generateCards(difficultySettings.x, difficultySettings.y);
  printCards();
  listenCards();
};

replayBtn.addEventListener("click", launchGame);

launchGame();
