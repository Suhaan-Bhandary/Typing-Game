// JavaScript Code for the Typing Game.

// Grabbing all the required elements.
const sentence = document.querySelector(".sentence");
const wrongCounter = document.querySelector(".wrongCounter");
const textInput = document.querySelector("#myTyping");
const endDisplay = document.querySelector(".endDisplay");
const againButton = document.querySelector("#again");

// Feedback text for the typing game.
const typingSpeedCompare = {
  10: "At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).",

  20: "At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).",

  30: "At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).",

  40: "At 41 , you are now an average typist. You still have significant room for improvement.",

  50: "Congratulations! You’re above average.",

  60: "This is the speed required for most high-end typing jobs. You can now be a professional typist!",

  70: "You are way above average! You would qualify for any typing job assuming your typing accuracy is high enough.",

  80: "You’re a catch! Any employer looking for a typist would love to have you.",

  90: "At this typing speed, you’re probably a gamer, coder, or genius. Either way, you’re doing great!",

  100: "You are in the top 1% of typists! Congratulations!",
};

// A bag of sentence to use when the api is down or the internet is down.
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

let sentenceText = "";

// Assigning variables :

// All this are changed when we restart the game.
let backSpacesRequired = 0, // To keep track of the wrong letters typed.
  index = 0,
  wrongCount = 0,
  letterCount = 0,
  currentWordTyping = [], // To keep track of the word we are typing.
  typingStarted = false,
  errorFreeFlag = true;

// Time tracking variables :
let startTime, previousTime, endTime;

// Graph Variables :
let PlayerData = [],
  graphdata = [],
  chartCreated = false;

// Running the setup :
initialStructure();

// The initialStructure is async as we will wait for the api to respond and then store it in the variable.
async function initialStructure() {
  // Waiting for the onRestart function to End.
  await onRestartCondition("restart");

  // Initializing the event listener for key events.
  textInput.addEventListener("keydown", (e) => {
    if (!typingStarted) typingStartedCondition(); // Condtion to check if Typing is Started.

    // Function to check if the key pressed is right or wrong and perform further actions.
    checkKeyCondition(e);

    // Checking if the word ended and also all the previous words are correctly typed.
    if (e.key == " " && backSpacesRequired === 0) {
      recordGraphData(); // Records the data for every word in the graph.

      // Reseting the textInput and also the current word.
      textInput.value = "";
      currentWordTyping = [];
    }

    refreshWindow();
  });

  refreshWindow();
}

// Condition to restart ,playAgain or take Input depending on the arguments.
// It is also async as it also waits for a function ot end.
async function onRestartCondition(functionType) {
  // We check the type of function we have to use.
  switch (functionType) {
    case "restart":
      PlayerData = [];
      graphdata = [];
      await textGenerator();
      break;
    case "playAgain":
      graphdata = [];
      againButton.style.display = "none";
      break;
    case "userInput":
      PlayerData = [];
      graphdata = [];
      do {
        sentenceText = prompt("Enter a sentence  :  ");
      } while (
        sentenceText == null ||
        sentenceText == undefined ||
        sentenceText.length == 0
      );
      break;
    default:
      console.error("NOT valid function call");
      break;
  }

  index = 0;
  wrongCount = 0;
  letterCount = 0;
  backSpacesRequired = 0;
  currentWordTyping = [];
  typingStarted = false;
  errorFreeFlag = true;

  // Changing the Html and css of the elements
  endDisplay.style.display = "none";
  sentence.innerHTML = `<h1>${sentenceText}</h1>`;
  textInput.style.display = "block";
  textInput.value = "";

  textInput.focus();
  textInput.select();
  refreshWindow();
}

// Function genterates text based on the condition.
async function textGenerator() {
  let randomIndex = Math.floor(Math.random() * facts.length); // generating a random number for choosing a text.
  sentenceText = "";

  // Grabbing the text from api.
  if (window.navigator.onLine) {
    sentenceText = await getRandomTextThroughApi();
  }

  // Checking if the text is valid.
  if (sentenceText === undefined || sentenceText.length === 0) {
    sentenceText = facts[randomIndex];
  } else {
    // making the text easier to type.
    sentenceText = sentenceText.replace(
      /[`~@#$%^&*()_|+\-?;:<>\n\t\r\{\}\[\]\\\/]/gi,
      ""
    );
  }
}

// Return the a string from the api.
function getRandomTextThroughApi() {
  const apiUrl =
    "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      return data.joke;
    })
    .catch((err) => {
      console.error(err);
    });
}

// Function to refresh Window when called.
function refreshWindow() {
  wrongCounter.innerHTML = `<p>Extra key-strokes : ${wrongCount} </p>`;

  // To make the right corrected word green and wrong red and not typed word gray.
  if (backSpacesRequired == 0) {
    rightText = sentenceText.slice(0, letterCount);

    if (letterCount == sentenceText.length) {
      currentText = "";
    } else {
      currentText = sentenceText[letterCount];
    }

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

// Function to handel the case when typing is started.
function typingStartedCondition() {
  console.log("Starting.");
  typingStarted = true;
  startTime = new Date();
  previousTime = new Date();
}

// Function to record the graph data for every word typed..
function recordGraphData() {
  const currentTime = new Date();
  timeTakenToTypeAWordInSeconds = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  graphdata.push([currentWordTyping, timeTakenToTypeAWordInSeconds]);
}

// Function to check the key entered and take action accordingly.
function checkKeyCondition(e) {
  if (e.key === sentenceText[index]) {
    currentWordTyping.push(e.key);
    correctKeyConditionHandle();
    return;
  }
  wrongKeyConditionHandle(e);
}

// Function to handel,if the key is correct.
function correctKeyConditionHandle() {
  // checking if any letter was wrong typed before it.
  if (errorFreeFlag) {
    // If this is the last character.
    if (index === sentenceText.length - 1) {
      endCondition();
    } else {
      index = index + 1;
    }

    letterCount = letterCount + 1;
  } else {
    wrongCount = wrongCount + 1;
    backSpacesRequired = backSpacesRequired + 1;
  }
}

// Function to handel,if the key is wrong.
function wrongKeyConditionHandle(e) {
  letterTyped = e.key;

  if (letterTyped == "Backspace") {
    currentWordTyping.pop();
    backScpaceConditionHandle();

    if (e.ctrlKey) deleteWholeWord();
  } else if (
    letterTyped == "Control" ||
    letterTyped == "Shift" ||
    letterTyped == "CapsLock" ||
    letterTyped == "Enter" ||
    letterTyped == "Tab"
  ) {
    return;
  } else {
    regularWrongConditionHandle();
    currentWordTyping.push(letterTyped);
  }
}

// Condition on pressing the backSpace key.
function backScpaceConditionHandle() {
  // errorFreeFlag tells us that the typing is error free.
  if (errorFreeFlag) {
    if (index != 0) index = index - 1;
    if (letterCount != 0) letterCount--;
    wrongCount++;
  } else {
    backSpacesRequired--;
    if (backSpacesRequired == 0) {
      errorFreeFlag = true;
    }
  }
}

// Delets the whole word when called.
function deleteWholeWord() {
  let wordLengthToDelete =
    currentWordTyping.length - currentWordTyping.lastIndexOf(" ");

  let newWord = currentWordTyping
    .slice(0, currentWordTyping.length - wordLengthToDelete + 1)
    .join("");

  letterCount = letterCount - (currentWordTyping.length - backSpacesRequired);
  index = letterCount;

  if (wordLengthToDelete > backSpacesRequired) {
    backSpacesRequired = 0;
    errorFreeFlag = true;
  } else {
    backSpacesRequired = backSpacesRequired - wordLengthToDelete + 1;
    errorFreeFlag = false;
  }

  currentWordTyping = newWord.split("");
}

// Function handel the state if the function is called.
function regularWrongConditionHandle() {
  backSpacesRequired++;
  wrongCount++;
  errorFreeFlag = false;
}

// Function to handel the case when typing is started.
function endCondition() {
  endTime = new Date();

  // Recording the last word and then generation the graphdata using the graphdata variable.
  recordGraphData();

  if (window.navigator.onLine) generateGraph();

  let timePassedInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  let timePassedInMinutes = timePassedInSeconds / 60;

  let typingSpeed = letterCount / (5 * timePassedInMinutes);
  let rawSpeed = (letterCount + wrongCount) / (5 * timePassedInMinutes);
  let accuracy = 100 - (wrongCount / (letterCount + wrongCount)) * 100;

  endDisplay.style.display = "block"; // Displaying the endDisplay.
  textInput.style.display = "none"; // Hiding the text input.
  againButton.style.display = "inline-block"; // Displaying the againButton.

  endDisplay.innerHTML = `
    <h1> Wpm : ${typingSpeed.toFixed(0)} </h1>
    <h1> Raw Speed : ${rawSpeed.toFixed(0)} </h1>
    <h1> Acurracy : ${accuracy.toFixed(2)} </h1>
    <p>${typingSpeedCompare[Math.floor(typingSpeed / 10) * 10]}</p>
    `;

  window.scrollTo(0, document.querySelector(".graphContainer").scrollHeight);
}

// Generates the Graph when called.
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

  let timePassedInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  let timePassedInMinutes = timePassedInSeconds / 60;
  let typingSpeed = letterCount / (5 * timePassedInMinutes);
  let accuracy = 100 - (wrongCount / (letterCount + wrongCount)) * 100;

  PlayerData.push({
    label:
      (PlayerData.length + 1).toString() +
      " : " +
      typingSpeed.toFixed(0) +
      "Wpm " +
      accuracy.toFixed(0) +
      "%",
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
          min: 0,
        },
      },
    },
  });

  chartCreated = true;
}
