let board;
let canvasWidth = 800;
let canvasHeight = 600;
let ctx;
let gameStarted = false;
let gameOver = false;

// Player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 60;

let player = {
    x: canvasWidth / 2 - playerWidth / 2,
    y: canvasHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

// Ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY

}

// Blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 20;
let blockColumns = 13;
let blockRows = 5;
let blockMaxRows = 10;
let blockCount = 0;

let blockX = 15;
let blockY = 45;

let score = 0;

function outOfBounds(xPosition) {
    return xPosition < 0 || xPosition + player.width > canvasWidth;    
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

function isBallTouchingTop(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function isBallBelowBlock(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftWallTouch(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightWallTouch(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c * (blockWidth + 10),
                y: blockY + r * (blockHeight + 10),
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        let nextPlayerX = player.x - player.velocityX;
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    } else if (e.code == "ArrowRight") {
        let nextPlayerX = player.x + player.velocityX;
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
}

function initializeGame() {
    player.x = canvasWidth / 2 - playerWidth / 2;
    player.y = canvasHeight - playerHeight - 5;
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    ball.velocityX = ballVelocityX;
    ball.velocityY = ballVelocityY;
    createBlocks();
    gameOver = false;
}

function resetGame() {
    gameOver = false;
    initializeGame();
}

function startGame() {
    document.getElementById("title-screen").style.display = "none";
    gameStarted = true;
    initializeGame();
    update();
}

function update() {
    requestAnimationFrame(update);
    
    if (!gameStarted) {
        ctx.clearRect(0, 0, board.width, board.height);
        ctx.fillStyle = "#fff";
        ctx.font = "24px 'Press Start 2P', cursive";
        ctx.fillText("Press 'Start Game' to begin", 50, canvasHeight / 2);
        return;
    }

    if (gameOver) {
        ctx.clearRect(0, 0, board.width, board.height);
        ctx.fillStyle = "#fff";
        ctx.font = "24px 'Press Start 2P', cursive";
        ctx.fillText("Game Over: Press 'Space' to Restart", 50, canvasHeight / 2);
        return;
    }

    ctx.clearRect(0, 0, board.width, board.height);

    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (gameStarted) {
        ctx.fillStyle = "white";
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    if (ball.y <= 0) {
        ball.velocityY *= -1;
    } else if (ball.x <= 0 || ball.x + ball.width >= canvasWidth) {
        ball.velocityX *= -1;
    } else if (ball.y + ball.height >= canvasHeight) {
        gameOver = true;
    }

    if (isBallTouchingTop(ball, player) || isBallBelowBlock(ball, player)) {
        ball.velocityY *= -1;
    } else if (leftWallTouch(ball, player) || rightWallTouch(ball, player)) {
        ball.velocityX *= -1;
    }

    ctx.fillStyle = "purple";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (isBallTouchingTop(ball, block) || isBallBelowBlock(ball, block)) {
                block.break = true;
                ball.velocityY *= -1;
                blockCount -= 1;
                score += 10;
            } else if (leftWallTouch(ball, block) || rightWallTouch(ball, block)) {
                block.break = true;
                ball.velocityX *= -1;
                blockCount -= 1;
                score += 10;
            }
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    if (blockCount == 0) {
        score += 10 * blockRows * blockColumns;
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    ctx.font = "20px Rubik Vinyl";
    ctx.fillText("Score: " + score, 10, 25);
}

window.addEventListener('resize', function () {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    board.width = canvasWidth;
    board.height = canvasHeight;
    initializeGame();
});

window.onload = function () {
    board = document.getElementById("board");
    board.width = canvasWidth;
    board.height = canvasHeight;
    ctx = board.getContext("2d");

    document.getElementById("start-button").addEventListener("click", startGame);
    document.addEventListener("keydown", movePlayer);
}

window.addEventListener("keydown", function(e) {
    // Check if the game is over and the spacebar is pressed
    if (gameOver && e.code === "Space") {
        resetGame(); // Reset the game
    }
});
window.addEventListener("keydown", movePlayer);