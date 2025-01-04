// Data for the game
const gameData = [
    { image: 'assets/respect.jpg', word: 'RESPECT' },
    { image: 'assets/caring.png', word: 'CARING' },
    { image: 'assets/royalty.jpeg', word: 'ROYALTY' },
    { image: 'assets/peace.jpg', word: 'PEACE' },
    { image: 'assets/patience.jpg', word: 'PATIENCE' },
    { image: 'assets/positivity.jpg', word: 'POSITIVITY' }
];

let currentGameIndex = 0;
let guessedWord = [];
let score = 0;
let timeLeft = 120; // 2 minutes in seconds
let timerInterval;

// Select elements
const imageElement = document.getElementById('game-image');
const letterBoxesElement = document.getElementById('letter-boxes');
const lettersElement = document.getElementById('letters');
const nextButton = document.getElementById('next-button');
const messageElement = document.getElementById('message');
const introPage = document.getElementById('intro-page');
const gameContainer = document.getElementById('game-container');
let timerDisplay;

// Timer Setup
function startTimer() {
    timerDisplay = document.createElement('p');
    timerDisplay.id = 'timer';
    timerDisplay.style.fontSize = '1.2rem';
    timerDisplay.style.marginTop = '10px';
    gameContainer.insertBefore(timerDisplay, messageElement);

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            clearInterval(timerInterval);
            endGame("Time Out!");
        }
    }, 1000);
}

// Start Game
function startGame() {
    introPage.style.display = 'none';
    gameContainer.style.display = 'block';
    startTimer();
    loadGame();
}

// Load the current game
function loadGame() {
    const currentGame = gameData[currentGameIndex];
    imageElement.src = currentGame.image;

    guessedWord = [];
    letterBoxesElement.innerHTML = '';
    lettersElement.innerHTML = '';
    messageElement.textContent = '';

    // Always enable the "Next" button
    nextButton.disabled = false;

    currentGame.word.split('').forEach(() => {
        const box = document.createElement('div');
        box.className = 'box';
        box.onclick = () => handleBoxClick(box);
        letterBoxesElement.appendChild(box);
    });

    const scrambledLetters = shuffleArray([...currentGame.word]);
    scrambledLetters.forEach((letter) => {
        const letterElement = document.createElement('div');
        letterElement.className = 'letter';
        letterElement.textContent = letter;
        letterElement.onclick = () => handleLetterClick(letterElement, letter);
        letterElement.dataset.used = "false"; // Initialize letter as not used
        lettersElement.appendChild(letterElement);
    });
}

// Handle Letter Click
function handleLetterClick(element, letter) {
    if (element.dataset.used === "true") return; // Prevent reusing the same letter

    if (guessedWord.length < gameData[currentGameIndex].word.length) {
        guessedWord.push(letter);
        element.dataset.used = "true"; // Mark the letter as used
        element.style.visibility = 'hidden';

        const boxes = document.querySelectorAll('.box');
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].textContent === '') {
                boxes[i].textContent = letter;
                boxes[i].dataset.letter = letter; // Track letter in box
                break;
            }
        }

        // Check if guessed word is correct
        if (guessedWord.join('') === gameData[currentGameIndex].word) {
            score++;
            messageElement.textContent = 'Correct!';
        } else if (guessedWord.length === gameData[currentGameIndex].word.length) {
            messageElement.textContent = 'Incorrect! Try Again.';
        }
    }
}

// Handle Box Click
function handleBoxClick(box) {
    const letter = box.dataset.letter;
    if (!letter) return; // Skip empty boxes

    box.textContent = '';
    box.dataset.letter = ''; // Clear the letter tracking
    guessedWord = guessedWord.filter((l) => l !== letter); // Remove letter from guessedWord

    // Make the corresponding letter visible again in the letter pool
    const letters = Array.from(lettersElement.children);
    const letterElement = letters.find((el) => el.textContent === letter && el.dataset.used === "true");
    if (letterElement) {
        letterElement.style.visibility = 'visible';
        letterElement.dataset.used = "false"; // Mark as unused
    }
}

// Proceed to Next Game
nextButton.onclick = () => {
    currentGameIndex++;
    if (currentGameIndex < gameData.length) {
        loadGame();
    } else {
        clearInterval(timerInterval);

        // Hide the timer if completed within 2 minutes
        if (timeLeft > 0 && timerDisplay) {
            timerDisplay.style.display = 'none';
        }

        endGame(`Congratulations! You scored ${score} out of ${gameData.length}`);
    }
};

// Shuffle Letters
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// End Game
function endGame(message) {
    messageElement.textContent = message;
    messageElement.classList.add('win-message');
    nextButton.disabled = true;
    lettersElement.innerHTML = '';
    letterBoxesElement.innerHTML = '';
}

// Start Game on Load
window.onload = () => {
    setTimeout(startGame, 3000);
};
