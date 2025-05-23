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

let selectedCard = undefined;
let scoreMultiplier = 10;

let score = 0;
let moves = 0;

/*-----------------CardList class definition-----------------*/

class CardList {
  //'constructor will define the behaviour of
  // calling 'new CardList(size)'
  constructor(size) {
    this.list = []; //this helps reset the game
    this.generateList(size);
    this.shuffle();
    this.display();
    this.listenCards();
  } // the constructor generate a new list
  // of -size- cards, shuffle them, inject
  // them on the HTML page and then sets the
  // eventListeners for each HTML element

  /*-----------------CardList Utils-----------------*/
  //Those are utilities functions, mostly here to improve
  //code lisibility

  remove(card) {
    this.list.splice(this.list.indexOf(card), 1);
  } //this removes -card- from the cardList

  pauseListeningForAll() {
    this.list.forEach((card) => card.pauseListening());
  } //this pauses the eventListener for
  //each card

  resumeListeningForAll() {
    this.list.forEach((card) => card.resumeListening());
  } //this resumes the eventListener for
  //each card

  /*-----------------Card Generator-----------------*/

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
      this.list.push(new Card(i, paireValue)); //call the Card constructor, defined later in code
    }
  } //Generate an ordered list of Card objects

  shuffle() {
    for (let i = this.list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.list[i];
      this.list[i] = this.list[j];
      this.list[j] = temp;
    }
  } //shuffle the Card objects by swapping one
  // random Card with the last, then an other
  // with last - 1, etc...

  display() {
    for (let i = 0; i < this.list.length; i++) {
      cardsContainer.innerHTML += `
      <div id="${this.list[i].id}" class="card">
        <img class="front-face" src="${this.list[i].src}">
        <img class="back-face" src="assets/back/back.jpg">
      </div>`;
    }
  } //Inject the cards inside the HTML, setting a correct id
  // + the correct path for the image by using the pair value

  listenCards() {
    this.list.forEach((card) => card.listen());
  } //Sets up the eventListener for the game to work, iterating
  //througt the list and calling the listen method (defined later)
  //on each card
}

/*-----------------Card class definition-----------------*/
//the Card object contains the game logic + some usefull values
//for each card + some usefull methods
class Card {
  constructor(id, pair) {
    (this.id = `card-${id}`), // an id that we'll use to identify the corresponding HTML element when it's created
      (this.pair = pair), // a value that is shared by two Cards, iditenfying them as pairs
      (this.src = `assets/cards/${theme}/${pair + 1}.png`), //the path of the card image, using the pair value so that pairs get the same image
      (this.isFlip = false), //a boolean that checks the state of the card
      (this.div = undefined); //the corresponding HTML element, set to undefined here because the HTML has not been injected yet when the constructor is called
  }

  /*-----------------Card Utils-----------------*/

  listen() {
    this.div = document.getElementById(this.id);
    this.div.addEventListener("click", this.select.bind(this));//bind(this) is mandatory here, without it /this/ points to the div and not the Card in the function's context (could also use a () => {} but it already works so...)
  }//Saves the HTML element in this.div + sets up the event listener on that div

  pauseListening() {
    this.div.style.pointerEvents = "none";
  }//Suspend the event listener for this particular Card

  resumeListening() {
    this.div.style.pointerEvents = "";
  }//resumes the event listener for this particular Card

  flip() {
    switch (this.isFlip) {
      case true:
        this.isFlip = false;
        this.resumeListening();
        this.div.classList.remove("flip");
        break;
      default:
        this.isFlip = true;
        this.pauseListening();
        this.div.classList.add("flip");
    }
  }//Depending on the state of the Card, pauses the
  // event listener and flip to show, or resumes the
  // event listener and flip to hide

  /*-----------------Gameplay-----------------*/

  win() {
    score += 5 * scoreMultiplier;
    cardList.remove(this);         //We remove both Cards from the list so that they don't became clickable
    cardList.remove(selectedCard);//again when we call resumeListenerForAll method after a lose() call, + we can actually use that behaviour to know when the game is over
    selectedCard = undefined;
    if (cardList.list.length === 0) { //Since we remove the Cards from cardList.list at each win, we know the game is over when the list is empty
      console.log("a winner is you");
    }
  }

  lose() {
    if (scoreMultiplier > 1) scoreMultiplier--;
    cardList.pauseListeningForAll();
    setTimeout(() => {
      selectedCard.flip();
      this.flip();
      selectedCard = undefined;
      cardList.resumeListeningForAll();
    }, 700);
  }

  select() {
    if (!timer.hasStarted) timer.start();
    this.flip();
    if (!selectedCard) selectedCard = this;
    else if (selectedCard.pair === this.pair) this.win();
    else this.lose();
    moves++;
    updateGameInfos();
  }
}

let cardList = new CardList(difficultySettings.x * difficultySettings.y); //Creating the object launches the game

/*---------------Chrono---------------*/

const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

class Timer {
  constructor() {
    this.totalSeconds = 0;
    this.hasStarted = false;
    this.interval = null;
  }

  getTimerString(time) {
    return time.toString().padStart(2, "0");
  };

  addSecond() {
    this.totalSeconds++;
    seconds.textContent = this.getTimerString(this.totalSeconds % 60);
    minutes.textContent = this.getTimerString(Math.floor(this.totalSeconds / 60));
  };

  start() {
    if (!this.hasStarted) {
      this.hasStarted = true;
      this.interval = setInterval(this.addSecond, 1000);
    }
  };

  reset() {
    clearInterval(this.interval);
    this.hasStarted = false;
    this.totalSeconds = 0;
    seconds.textContent = "00";
    minutes.textContent = "00";
    this.interval = null;
  };
};

const timer = new Timer();

/*---------------Interface---------------*/

const updateGameInfos = () => {
  const scoreSpan = document.getElementById("current-score-span");
  const movesSpan = document.getElementById("moves-span");

  scoreSpan.textContent = score;
  movesSpan.textContent = moves;
};

/*---------------Replay-Button---------------*/

const resetGame = () => {
  score = 0;
  moves = 0;
  numberOfFounds = 0;
  scoreMultiplier = 10;
  cardsContainer.innerHTML = "";
  selectedCard = undefined;
  timer.reset();
  updateGameInfos();
  cardList = new CardList(difficultySettings.x * difficultySettings.y);
};

replayBtn.addEventListener("click", resetGame);
