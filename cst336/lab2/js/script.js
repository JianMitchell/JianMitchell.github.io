//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);
document.querySelector("#playerGuess").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    checkGuess();
  }
});


//Global variables
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;
const MAX_ATTEMPTS = 7;

initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1;
  console.log("randomNumber: " + randomNumber);
  attempts = 0;

  // attempts left
  updateAttemptsLeft();

  //hiding the Reset button
  document.querySelector("#resetBtn").style.display = "none";

  //adding focus to textbox
  document.querySelector("#guessBtn").style.display = "inline";

  let playerGuess = document.querySelector("#playerGuess");
  playerGuess.focus();
  playerGuess.value = "";
  playerGuess.disabled = false;

  let feedback = document.querySelector("#feedback");
  feedback.textContent = "";

  document.querySelector("#guesses").textContent = "";
}

function updateAttemptsLeft() {
  document.querySelector("#attemptsLeft").textContent = String(MAX_ATTEMPTS - attempts);
}

function updateStats() {
  document.querySelector("#wins").textContent = String(wins);
  document.querySelector("#losses").textContent = String(losses);
}

function gameOver() {
  let guessBtn = document.querySelector("#guessBtn");
  let resetBtn = document.querySelector("#resetBtn");
  let playerGuess = document.querySelector("#playerGuess");

  guessBtn.style.display = "none";
  resetBtn.style.display = "inline";
  playerGuess.disabled = true;
}

function checkGuess(){
  let feedback = document.querySelector("#feedback");
  feedback.textContent = "";

  let guess = document.querySelector("#playerGuess").value;
  console.log("Player guess: " + guess);

  guess = parseInt(guess);

  if (guess === Number("") || !guess || typeof guess !== 'number') {
    feedback.textContent = "Please enter a valid number";
    feedback.style.color = "red";
    return;
  }

  if (guess < 1 || guess > 99) {
    feedback.textContent = "Enter a number between 1 and 99";
    feedback.style.color = "red";
    return;
  }

  attempts++;

  console.log("Attempts:" + attempts);

  updateAttemptsLeft();

  feedback.style.color = "orange";

  if (Number(guess) === randomNumber) {
    feedback.textContent = "You guessed it! You Won!";
    feedback.style.color = "darkgreen";

    wins++;

    updateStats();
    gameOver();
  } else {
    document.querySelector("#guesses").textContent += guess + " ";

    if (Number(attempts) === MAX_ATTEMPTS) {
      feedback.textContent = "Sorry, you lost! The number was " + randomNumber;
      feedback.style.color = "red";

      losses++;

      updateStats();
      gameOver();
    } else if (guess > randomNumber) {
      feedback.textContent = "Guess was high";
    } else {
      feedback.textContent = "Guess was low"
    }
  }
}