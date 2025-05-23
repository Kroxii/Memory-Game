const settingsBtn = document.getElementById("settings-btn");
const settingsScroll = document.getElementById("settings-scroll");
const themeSettings = document.getElementById("theme-settings");
const gameSettings = document.getElementById("game-settings");
const victoryScreen = document.getElementById("victory-screen");
const cardsContainer = document.getElementById("cards-container");
const replayBtn = document.getElementById("replay-btn");
const theme = "pokemon";

const scoreSpan = document.getElementById("current-score-span");
const movesSpan = document.getElementById("moves-span");

let difficultySettings = { x: 4, y: 4 };

/*---------------Interface---------------*/

class Interface {
  constructor() {
    this.scoreSpan = document.getElementById("current-score-span");
    this.movesSpan = document.getElementById("moves-span");
    this.highestScoreSpan = document.getElementById("highest-score-span");
    this.highestScore = this.loadHighScore();
    this.moves = 0;

    this.launch();
  }

  /*---------------Highest-Score---------------*/

  loadHighScore() {
    const stored = localStorage.getItem("highscore");
    if (stored) {
      return parseInt(stored);
    } else {
      return 0;
    }
  };
  // Load the highscore from localStorage

  saveHighScore(newScore) {
    if (newScore > this.highestScore) {
      localStorage.setItem("highscore", newScore);
      this.highestScore = newScore;
      this.highestScoreSpan.innerText = newScore;
    }
  };
  // Save the new highscore in localStorage
  // if it's higher than the previous one

  update() {
    this.moves++;
    this.scoreSpan.innerText = game.score;
    this.movesSpan.innerText = this.moves;
  }

  launch() {
    this.scoreSpan.innerText = 0;
    this.movesSpan.innerText = 0;
    this.highestScoreSpan.innerText = this.highestScore;
  }

  reset() {
    this.moves = 0;
    this.scoreSpan.innerText = 0;
    this.movesSpan.innerText = 0;
    this.highestScoreSpan.innerText = this.highestScore;
  }
}

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
      this.interval = setInterval(this.addSecond.bind(this), 1000);
    }
  };

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  };

  reset() {
    this.stop();
    this.hasStarted = false;
    this.totalSeconds = 0;
    seconds.textContent = "00";
    minutes.textContent = "00";
  };
};

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
//the Card object contains the cards infos +
// some usefull methods
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
    this.div.addEventListener("click", () => game.select(this));
  } //Saves the HTML element in this.div + sets up the event listener on that div

  pauseListening() {
    this.div.style.pointerEvents = "none";
  } //Suspend the event listener for this particular Card

  resumeListening() {
    this.div.style.pointerEvents = "";
  } //resumes the event listener for this particular Card

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
  } //Depending on the state of the Card, pauses the
  // event listener and flip to show, or resumes the
  // event listener and flip to hide

}

/*-----------------Gameplay-----------------*/

class Game {
  constructor(size) {
    this.score = 0;
    this.scoreMultiplier = 10;
    this.firstSelectedCard = undefined;
    this.secondSelectedCard = undefined;

    this.interface = new Interface();
    this.cardList = new CardList(size);
    this.timer = new Timer();
  }

  win() {
    this.timer.stop();
    this.interface.saveHighScore(this.score);
    victoryScreen.innerHTML += `<strong id="you-won">You won the game in ${this.interface.moves} moves!</strong>
    <ul id="victory-infos">
      <li id="victory-score">Your score: ${this.score}</li>
      <li id="victory-time">Your time: ${minutes.textContent}:${seconds.textContent}</li>
    </ul>`;
  }

  isPair() {
    this.score += 5 * this.scoreMultiplier;
    this.cardList.remove(this.firstSelectedCard); //We remove both Cards from the list so that they don't became clickable
    this.cardList.remove(this.secondSelectedCard); //again when we call resumeListenerForAll method after a isNotPair() call,
    this.firstSelectedCard = undefined;          //+ we can actually use that behaviour to know when the game is over
    this.secondSelectedCard = undefined;
  }

  isNotPair() {
    if (this.scoreMultiplier > 1) this.scoreMultiplier--;
    this.cardList.pauseListeningForAll();
    setTimeout(() => {
      this.firstSelectedCard.flip();
      this.secondSelectedCard.flip();
      this.firstSelectedCard = undefined;
      this.secondSelectedCard = undefined;
      this.cardList.resumeListeningForAll();
    }, 700);
  }

  select(card) {
    if (!this.timer.hasStarted)
      this.timer.start();

    card.flip();
    if (!this.firstSelectedCard)
      this.firstSelectedCard = card
    else {
      this.secondSelectedCard = card;
      if (this.firstSelectedCard.pair === this.secondSelectedCard.pair)
        this.isPair();
      else
        this.isNotPair();
    }

    this.interface.update()
    if (this.cardList.list.length === 0) //Since we remove the Cards from cardList.list at each found pair, we know the game is over when the list is empty
      this.win();
  }

  reset() {
    this.score = 0;
    this.scoreMultiplier = 10;

    this.firstSelectedCard = undefined;
    this.secondSelectedCard = undefined;
  
    this.interface.reset();
    this.timer.reset();

    cardsContainer.innerHTML = "";
    victoryScreen.innerHTML = "";

    this.cardList = new CardList(difficultySettings.x * difficultySettings.y);
  }
}

const game = new Game(difficultySettings.x * difficultySettings.y);

replayBtn.addEventListener("click", game.reset.bind(game));

const themeToggleBtn = document.getElementById("theme-toggle-btn");
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Change icon
  if (document.body.classList.contains("dark-mode")) {
    themeToggleBtn.textContent = "☀️";
  } else {
    themeToggleBtn.textContent = "🌙";
  }
});
