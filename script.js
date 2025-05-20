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

let difficultySettings = { x: 4, y: 4 };
let numberOfPairs = (difficultySettings.x * difficultySettings.y) / 2;

let numberOfFounds = 0;
let selectedCard = undefined;
let scoreMultiplier = 10;

let score = 0;
let moves = 0;

class CardList {
  constructor(size) {
    this.list = [];
    this.generateList(size);
    this.shuffle();
    this.display();
    this.listenCards();
  }

  remove(card) {
    this.list.splice(this.list.indexOf(card), 1);
  }

  resumeListeningForAll() {
    this.list.forEach((card) => {
      if (!card.isFound) card.resumeListening();
    });
  }

  pauseListeningForAll() {
    this.list.forEach((card) => {
      if (!card.isFound) card.pauseListening();
    });
  }

  generateList(size) {
    let paireValue = 0;
    let incr = false;

    for (let i = 0; i < size; i++) {
      if (incr) {
        paireValue++;
        incr = false;
      } else if (i !== 0) {
        incr = true;
      }
      this.list.push(new Card(i, paireValue));
    }
  }

  shuffle() {
    for (let i = this.list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.list[i];
      this.list[i] = this.list[j];
      this.list[j] = temp;
    }
  }

  display() {
    for (let i = 0; i < this.list.length; i++) {
      cardsContainer.innerHTML += `
      <div id="${this.list[i].id}" class="card">
        <img class="front-face" src="${this.list[i].src}">
        <img class="back-face" src="assets/back/back.jpg">
      </div>`;
    }
  }

  listenCards() {
    this.list.forEach((card) => card.listen());
  }
}

class Card {
  constructor(id, pair) {
    (this.id = `card-${id}`),
      (this.pair = pair),
      (this.src = `assets/cards/${theme}/${pair + 1}.png`),
      (this.isFound = false),
      (this.isFlip = false),
      (this.div = undefined);
  }

  flip() {
    switch (this.isFlip) {
      case true:
        this.isFlip = false;
        this.div.style.pointerEvents = "";
        this.div.classList.remove("flip");
        break;
      default:
        this.isFlip = true;
        this.div.style.pointerEvents = "none";
        this.div.classList.add("flip");
    }
  }

  win() {
    score += 5 * scoreMultiplier;
    numberOfFounds++;
    cardList.remove(this);
    cardList.remove(selectedCard);
    selectedCard = undefined;
    if (cardList.list.length === 0) {
      console.log('a winner is you');
    }
  }

  lose() {
    if (scoreMultiplier > 1) scoreMultiplier = scoreMultiplier--;
    cardList.pauseListeningForAll();
    setTimeout(() => {
      selectedCard.flip();
      this.flip();
      selectedCard = undefined;
      cardList.resumeListeningForAll();
    }, 700);
  }

  select() {
    if(!timerStart) cardClick();
    this.flip();
    if (!selectedCard) selectedCard = this;
    else if (selectedCard.pair === this.pair) this.win();
    else this.lose();
  }

  pauseListening() {
    this.div.style.pointerEvents = "none";
  }

  resumeListening() {
    this.div.style.pointerEvents = "";
  }

  listen() {
    this.div = document.getElementById(this.id);
    this.div.addEventListener("click", this.select.bind(this));
  }
}

let cardList = new CardList(difficultySettings.x * difficultySettings.y);

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
    timerInterval = setInterval(setTimer, 500);
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
      cardsNodeList.forEach((el) => (el.style.pointerEvents = "none"));
      setTimeout(() => {
        cardEl.classList.remove("flip");
        previousCardEl.classList.remove("flip");
        // Réactive les clics
        cardsNodeList.forEach((el) => (el.style.pointerEvents = ""));
      }, 1000); // 1 seconde avant de retourner les cartes
    }
    endRound(selectedCard.pair === card.pair, [selectedCard, card]);
  }

  moves++;
  if (numberOfFounds === numberOfPairs) endGame();
  updateGameInfos();
};

/*---------------Replay-Button---------------*/

const resetGame = () => {
  score = 0;
  moves = 0;
  numberOfFounds = 0;
  scoreMultiplier = 10;
  cardsContainer.innerHTML = "";
  selectedCard = undefined;
  numberOfPairs = (difficultySettings.x * difficultySettings.y) / 2;
  resetTimer();
  updateGameInfos();
  cardList = new CardList(difficultySettings.x * difficultySettings.y);
};

replayBtn.addEventListener("click", resetGame);
