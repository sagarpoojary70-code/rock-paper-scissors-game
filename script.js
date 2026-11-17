
// ======================================
// ROCK PAPER SCISSORS GAME
// ======================================

let userScore = 0;
let computerScore = 0;

let isPlaying = false;
let gameOver = false;

const THINKING_TIME = 2;
let remainingTime = THINKING_TIME;
let timerInterval = null;

// Winning score
let selectedWinningScore = 10;

// HTML Elements
const userScoreDisplay = document.getElementById("user-score");
const computerScoreDisplay = document.getElementById("computer-score");

const userChoiceDisplay = document.getElementById("user-choice");
const computerChoiceDisplay = document.getElementById("computer-choice");

const resultDisplay = document.getElementById("result");
const messageDisplay = document.getElementById("message");

const timerDisplay = document.getElementById("timer");
const timerMessage = document.getElementById("timer-message");

const choices = document.querySelectorAll(".choice");

const winningScoreSelect = document.getElementById("winning-score");

const modal = document.getElementById("result-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");

const closeModal = document.getElementById("close-modal");
const resetButton = document.getElementById("reset-btn");

const options = ["rock", "paper", "scissors"];

const icons = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};


// ======================================
// COMPUTER PICK
// ======================================

function computerPick() {
    return options[Math.floor(Math.random() * options.length)];
}


// ======================================
// DETERMINE WINNER
// ======================================

function determineWinner(user, computer) {

    if (user === computer) return "draw";

    if (
        (user === "rock" && computer === "scissors") ||
        (user === "paper" && computer === "rock") ||
        (user === "scissors" && computer === "paper")
    ) {
        return "win";
    }

    return "lose";
}


// ======================================
// TIMER
// ======================================

function updateTimer() {

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// ======================================
// BUTTON CONTROL
// ======================================

function setChoicesDisabled(disabled) {

    choices.forEach(button => {
        button.disabled = disabled;
    });

}


// ======================================
// SHOW MODAL
// ======================================

function showModal(icon, title, message, buttonText) {

    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    closeModal.textContent = buttonText;

    modal.classList.add("show");

}


// ======================================
// PLAY GAME
// ======================================

function playGame(userChoice) {

    if (isPlaying || gameOver) return;

    isPlaying = true;
    setChoicesDisabled(true);

    const computerChoice = computerPick();

    userChoiceDisplay.textContent = icons[userChoice];
    computerChoiceDisplay.textContent = "🤔";

    remainingTime = THINKING_TIME;
    updateTimer();

    resultDisplay.textContent = "Computer is thinking...";
    messageDisplay.textContent = "Wait for the computer!";

    timerMessage.textContent = "Computer is choosing...";

    timerInterval = setInterval(() => {

        remainingTime--;
        updateTimer();

        timerMessage.textContent =
            `Computer is thinking... ${remainingTime} seconds remaining`;

        if (remainingTime <= 0) {

            clearInterval(timerInterval);
            timerInterval = null;

            finishRound(userChoice, computerChoice);

        }

    }, 1000);

}


// ======================================
// FINISH ROUND
// ======================================

function finishRound(userChoice, computerChoice) {

    computerChoiceDisplay.textContent = icons[computerChoice];

    timerDisplay.textContent = "00:00";
    timerMessage.textContent = "Computer has made its move!";

    userChoiceDisplay.classList.add("animate");
    computerChoiceDisplay.classList.add("animate");

    const result = determineWinner(userChoice, computerChoice);

    const movesMessage =
        `You showed ${icons[userChoice]} ${userChoice.toUpperCase()} | Computer showed ${icons[computerChoice]} ${computerChoice.toUpperCase()}`;

    if (result === "win") {

        userScore++;
        resultDisplay.textContent = "🎉 You Won This Round!";

    }
    else if (result === "lose") {

        computerScore++;
        resultDisplay.textContent = "💻 Computer Won This Round!";

    }
    else {

        resultDisplay.textContent = "🤝 It's a Draw!";

    }

    messageDisplay.textContent = movesMessage;

    userScoreDisplay.textContent = userScore;
    computerScoreDisplay.textContent = computerScore;

    // Check selected winning score
    if (userScore >= selectedWinningScore) {

        gameOver = true;

        showModal(
            "🏆",
            "YOU ARE THE CHAMPION!",
            `${movesMessage}. You reached ${selectedWinningScore} points!`,
            "Play Again"
        );

    }
    else if (computerScore >= selectedWinningScore) {

        gameOver = true;

        showModal(
            "🤖",
            "COMPUTER WINS!",
            `${movesMessage}. Computer reached ${selectedWinningScore} points!`,
            "Play Again"
        );

    }
    else {

        const roundIcon =
            result === "win" ? "🎉" :
            result === "lose" ? "😢" : "🤝";

        const roundTitle =
            result === "win" ? "You Won This Round!" :
            result === "lose" ? "You Lost This Round!" :
            "It's a Draw!";

        showModal(
            roundIcon,
            roundTitle,
            movesMessage,
            "Continue Playing"
        );

    }

    isPlaying = false;
    setChoicesDisabled(gameOver);

}


// ======================================
// WINNING SCORE CHANGE
// ======================================

winningScoreSelect.addEventListener("change", () => {

    selectedWinningScore = Number(winningScoreSelect.value);

    // Reset scores when target changes
    resetGame();

    messageDisplay.textContent =
        `New winning score is ${selectedWinningScore}. Good luck!`;

});


// ======================================
// PLAYER BUTTONS
// ======================================

choices.forEach(button => {

    button.addEventListener("click", () => {

        playGame(button.dataset.choice);

    });

});


// ======================================
// CLOSE MODAL
// ======================================

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

    if (gameOver) {
        resetGame();
    }

});

modal.addEventListener("click", event => {

    if (event.target === modal) {

        if (gameOver) {
            resetGame();
        } else {
            modal.classList.remove("show");
        }

    }

});


// ======================================
// RESET GAME
// ======================================

function resetGame() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);
        timerInterval = null;

    }

    userScore = 0;
    computerScore = 0;

    isPlaying = false;
    gameOver = false;

    remainingTime = THINKING_TIME;

    userScoreDisplay.textContent = 0;
    computerScoreDisplay.textContent = 0;

    userChoiceDisplay.textContent = "❔";
    computerChoiceDisplay.textContent = "❔";

    updateTimer();

    timerMessage.textContent = "Select your move to start!";

    resultDisplay.textContent = "Make Your Move!";

    messageDisplay.textContent =
        `Winning score: ${selectedWinningScore}. Choose your move!`;

    userChoiceDisplay.classList.remove("animate");
    computerChoiceDisplay.classList.remove("animate");

    setChoicesDisabled(false);

    modal.classList.remove("show");

}


// Reset button
resetButton.addEventListener("click", resetGame);


// ======================================
// INITIAL SETTINGS
// ======================================

selectedWinningScore = Number(winningScoreSelect.value);

updateTimer();
setChoicesDisabled(false);
