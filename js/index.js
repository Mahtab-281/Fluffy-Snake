// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = [7, 10, 12, 14, 16, 18];
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

food = { x: 6, y: 7 };

// Game Functions and speed control of the game
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    let i = 0;
    if (snakeArr.length > 10)
        i = 1;
    else if (snakeArr.length > 15)
        i = 2;
    else if (snakeArr.length > 25)
        i = 3;
    else if (snakeArr.length > 30)
        i = 4;
    else if (snakeArr.length > 35)
        i = 5;
    if ((ctime - lastPaintTime) / 1000 < 1 / speed[i]) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();


}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    let Level = document.getElementById("Level");
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
        Level.textContent = "Level: 0";
        scoreBox.innerHTML = "Score: " + score;
    }

    // If you have eaten the food, increment the score, increment the level and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }

        if (snakeArr.length > 35)
            Level.textContent = "Level: 5";
        else if (snakeArr.length > 30)
            Level.textContent = "Level: 4";
        else if (snakeArr.length > 25)
            Level.textContent = "Level: 3";
        else if (snakeArr.length > 15)
            Level.textContent = "Level: 2";
        else if (snakeArr.length > 10)
            Level.textContent = "Level: 1";

    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);
}



// Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 } // Start the game
    moveSound.play();
    if (e.key === "ArrowUp") {
        console.log("ArrowUp");
        inputDir.x = 0;
        inputDir.y = -1;

    } else if (e.key === "ArrowDown") {
        console.log("ArrowDown");
        inputDir.x = 0;
        inputDir.y = 1;
    } else if (e.key === "ArrowLeft") {
        console.log("ArrowLeft");
        inputDir.x = -1;
        inputDir.y = 0;
    } else if (e.key === "ArrowRight") {
        console.log("ArrowRight");
        inputDir.x = 1;
        inputDir.y = 0;

    }
});



// Touch Test
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1, Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);

window.addEventListener('touchstart', function (event) {
    event.preventDefault()
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

window.addEventListener('touchend', function (event) {
    event.preventDefault()
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {

        if (yx <= limit) {
            if (x < 0) {
                console.log("left");
                inputDir.x = -1;
                inputDir.y = 0;
            } else {
                console.log("right")
                inputDir.x = 1;
                inputDir.y = 0;
            }
        } else {
            if (y < 0) {
                console.log("bottom")
                inputDir.y = -1;
                inputDir.x = 0;
            } else {
                console.log("top")
                inputDir.y = 1;
                inputDir.x = 0;
            }
        }
    }
}