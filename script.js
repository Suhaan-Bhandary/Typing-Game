// selecting all the required elements.
const sentence = document.querySelector(".sentence");
const wrongCounter = document.querySelector(".wrongCounter");

const typingSpeedCompare = {
  10: "At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).",

  20: "Same as above.",

  30: "Same as above.",

  40: "At 41 , you are now an average typist. You still have significant room for improvement.",

  50: "Congratulations! You’re above average.",

  60: "This is the speed required for most high-end typing jobs. You can now be a professional typist!",

  70: "You are way above average! You would qualify for any typing job assuming your typing accuracy is high enough.",

  80: "You’re a catch! Any employer looking for a typist would love to have you.",

  90: "At this typing speed, you’re probably a gamer, coder, or genius. Either way, you’re doing great!",

  100: "You are in the top 1% of typists! Congratulations!",
};
// api url :
const apiUrl =
  "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

const facts = [
  "A parent may kill its children if the task assigned to them is no longer needed.",
  "Writing cryptic code is deep joy in the soul of a programmer.",

  "A coder is a person who transforms cola & pizza to code 'Refresh button' of the windows desktop is not some magical tool which keeps your computer healthy.",
  "The programmers are the main source of income for eye doctors.",
  "If any programmer orders three beers with his fingers, he normally only gets two.",
  "Programmers love to code day and night.",
  "Sleeping with a problem can actually solve it.",
  "When you format your hard drive, the files are not deleted.",
  "1 Mbps and 1 MBps internet connection don’t mean the same thing.",
  "A programmer is similar to a game of golf.",
  "The point is not getting the ball in the hole but how many strokes it takes",
  "A programmer is not a PC repairman.",
];
// To display letterTyped :
// const letterCounter = document.querySelector(".letterCounter");
// const backSpacesCounter = document.querySelector(".backSpacesCounter");
// const indicator = document.querySelector(".indicator");

const textInput = document.querySelector("#myTyping");
const endDisplay = document.querySelector(".endDisplay");

const actualSpeed = document.querySelector(".actualSpeed");
const rawSpeed = document.querySelector(".rawSpeed");

// initializing the sentence.
let wrongCount,
  letterCount,
  backSpacesRequired,
  flag,
  index,
  sentenceText = "",
  playAgain = false,
  chartCreated = false;

let myChart;
// if flag is false then the last typed key will wrong.
let wordTyping;
let started = false,
  startTime,
  endTime,
  previousTime;
let PlayerData = [];
let graphdata = [];

initialStructure(); // To form the initial structure of the page.

async function initialStructure() {
  await onRestart();

  textInput.addEventListener("keydown", (e) => {
    // Storing the start time.
    if (started == false) startCondition();

    // Cheching the winning condition.
    if (index === sentenceText.length - 1) {
      endCondition();
      return;
    }

    checkKeyCondition(e);

    // Checking if the word ended and also all the previous words are correctly typed.
    if (e.key == " " && backSpacesRequired == 0) {
      recordGraphData();
      textInput.value = "";
      wordTyping = [];
    }

    refreshWindow();
  });

  refreshWindow();
}

function recordGraphData() {
  const currentTime = new Date();
  timeTakenToTypeAWordInSeconds = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  graphdata.push([wordTyping, timeTakenToTypeAWordInSeconds]);
}

// Condition to restart the game.
async function onRestart() {
  graphdata = [];
  started = false;
  let isConnectedToInternet = window.navigator.onLine;
  endDisplay.style.display = "none";
  if (!playAgain) {
    PlayerData = [];
    if (isConnectedToInternet) {
      sentenceText = await getRandomText();
      if (sentenceText === undefined) {
        let num = Math.floor(Math.random() * facts.length);
        sentenceText = facts[num];
      } else {
        sentenceText = sentenceText.replace(
          /[`~@#$%^&*()_|+\-?;:<>\n\t\r\{\}\[\]\\\/]/gi,
          ""
        );
      }
    } else {
      let num = Math.floor(Math.random() * facts.length);
      sentenceText = facts[num];
    }
  }
  // "Work hard. Push yourself, because no one else is going to do it for you.";
  sentence.innerHTML = `<h1>${sentenceText}</h1>`;

  wrongCount = 0;
  letterCount = 0;
  backSpacesRequired = 0;
  flag = true; // if flag is false then the last typed key will wrong.
  index = 0;

  wordTyping = [];

  // To check Restart the board :
  textInput.style.display = "block";
  textInput.value = "";
  endDisplay.innerHTML = "";

  // To keep track of the time elasped.
  refreshWindow();
}

function OnPlayAgain() {
  playAgain = true;
  onRestart();
  playAgain = false;
}
function getRandomText() {
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      return data.joke;
    })
    .catch((err) => {
      console.error(err);
    });
}

// Function to handel the case when typing is started.
function startCondition() {
  console.log("Starting.");
  started = true;
  startTime = new Date();
  previousTime = new Date();
}
// Function to handel the case when typing is started.
function endCondition() {
  recordGraphData();
  generateGraph();

  document.querySelector(".again").style.display = "inline-block"; // For the again button

  endTime = new Date();

  let timePassedInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  let timePassedInMinutes = timePassedInSeconds / 60;

  let typingSpeed = letterCount / (5 * timePassedInMinutes);
  let rawSpeed = (letterCount + wrongCount) / (5 * timePassedInMinutes);
  let accuracy = 100 - (wrongCount / (letterCount + wrongCount)) * 100;

  endDisplay.style.display = "block";

  endDisplay.innerHTML = `
    <h1> Wpm : ${typingSpeed.toFixed(0)} </h1>
    <h1> Raw Speed : ${rawSpeed.toFixed(0)} </h1>
    <h1> Acurracy : ${accuracy.toFixed(2)} </h1>
    <p>${typingSpeedCompare[Math.floor(typingSpeed / 10) * 10]}</p>
    `;
  textInput.style.display = "none";
}
// Function to check the key and update the values acoording to it.
function checkKeyCondition(e) {
  if (e.key == sentenceText[index]) {
    wordTyping.push(e.key);
    correctKeyCondition();
    return;
  }

  wrongKeyCondition(e);
}

function correctKeyCondition() {
  if (flag) {
    // checking if any letter was wrong typed before it.
    letterCount = letterCount + 1;
    index = index + 1;
  } else {
    wrongCount = wrongCount + 1;
    backSpacesRequired = backSpacesRequired + 1;
  }
}

function wrongKeyCondition(e) {
  let letter = e.key;
  if (letter == "Backspace") {
    wordTyping.pop();
    backScpaceCondition();

    // TODO:
    if (e.ctrlKey) deleteWholeWord();
  } else if (
    letter == "Control" ||
    letter == "Shift" ||
    letter == "CapsLock" ||
    letter == "Enter" ||
    letter == "Tab"
  ) {
    return;
  } else {
    regularWrongCondition();
    wordTyping.push(letter);
  }
}

function backScpaceCondition() {
  if (flag) {
    if (index != 0) index = index - 1;
    if (letterCount != 0) letterCount--;
    wrongCount++;
  } else {
    backSpacesRequired--;
    if (backSpacesRequired == 0) {
      flag = true;
    }
  }
}

function deleteWholeWord() {
  let wordLengthToDelete = wordTyping.length - wordTyping.lastIndexOf(" ");

  let newWord = wordTyping
    .slice(0, wordTyping.length - wordLengthToDelete + 1)
    .join("");

  letterCount = letterCount - (wordTyping.length - backSpacesRequired);
  index = letterCount;

  if (wordLengthToDelete > backSpacesRequired) {
    backSpacesRequired = 0;
    flag = true;
  } else {
    backSpacesRequired = backSpacesRequired - wordLengthToDelete + 1;
    flag = false;
  }

  wordTyping = newWord.split("");
}

function regularWrongCondition() {
  backSpacesRequired++;
  wrongCount++;
  flag = false;
}

function generateGraph() {
  document.querySelector(".graphContainer").style.display = "flex";
  let ctx = document.getElementById("myChart").getContext("2d");
  let lables = [];
  let data = [];

  graphdata.forEach((ele) => {
    lables.push(ele[0].join(""));

    let timePassedInMinutes = ele[1] / 60;
    let typingSpeed = ele[0].length / (5 * timePassedInMinutes);
    data.push(typingSpeed);
  });

  PlayerData.push({
    label: PlayerData.length + 1,
    data: data,
    backgroundColor: [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ],
    borderWidth: 1,
  });

  if (chartCreated) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: lables,
      datasets: PlayerData,
    },
    options: {
      scales: {
        y: {
          ticks: {
            fontSize: 40,
          },
          min: 0,
        },
      },
    },
  });

  chartCreated = true;
}

function refreshWindow() {
  wrongCounter.innerHTML = `<p>Extra key-strokes : ${wrongCount} </p>`;
  // letterCounter.innerHTML = `<p>Letter Count ${letterCount} </p>`;
  // backSpacesCounter.innerHTML = `<p> Back Spaces needed : ${backSpacesRequired} </p>`;

  // endDisplay.innerHTML = `<p>${sentenceText[index]}</p>`;

  // backSpacesRequired > 0
  //   ? (indicator.style.background = "red")
  //   : (indicator.style.background = "green");

  // To make the right corrected word green and wrong red and not typed word gray.
  if (backSpacesRequired == 0) {
    rightText = sentenceText.slice(0, letterCount);
    currentText = sentenceText[letterCount];

    remainingText = sentenceText.slice(letterCount + backSpacesRequired + 1);
    sentence.innerHTML = `<h1><span id="right" >${rightText}</span><span id="currentText" >${currentText}</span><span id="remaining" >${remainingText}</span></h1>`;
  } else {
    rightText = sentenceText.slice(0, letterCount);

    wrongText = sentenceText.slice(
      letterCount,
      letterCount + backSpacesRequired
    );
    remainingText = sentenceText.slice(letterCount + backSpacesRequired);
    sentence.innerHTML = `<h1><span id="right" >${rightText}</span><span id="wrong" >${wrongText}</span><span id="remaining" >${remainingText}</span></h1>`;
  }
}
