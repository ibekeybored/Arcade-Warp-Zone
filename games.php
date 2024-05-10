
<!--
    Comp 490/491 Senior Design Project
    Arcade Warp Zone

    Sebastian Ibarra
    Angel Venegas
    Jake Anderson
    Robert Chicas
    Anthony Rosas
    Josue Ambrosio
    Troy Malaki

-->

<?php
// Start Session
session_start();

// Check if the user is not authenticated
if (!isset($_SESSION['username'])) {
header("Location: login.html");
exit();
}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Arcade Warp Zone</title>
    <link rel="icon" type="image/x-icon" href="/images/logo.ico">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
  </head>
  <body>
    <div class=header>
      <div class="logo">
        <a id="logo" href="dashboard.php"><img src="images/logo.png" alt="logo"></a>
      </div>
      <div class="navbar">
        <a href="dashboard.php">User Dashboard</a>
        <a href="logout.php">Logout</a>
      </div>
    </div>
    <div id="background-container">
        <video autoplay muted loop playsinline>
            <source src="/videos/stars.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="game-selection">
        <!-- Game 1 -->
        <div class="game">
            <h1>Pong</h1>
            <a href="./games/pong/pong.php"><img src="/images/title_images/pong.png" alt="pong_game"></a>
        </div>

        <!-- Game 2 -->
        <div class="game">
            <h1>Snake Apple Eater</h1>
            <a href="./games/snake/snake.php"><img src="images/title_images/snake.png" alt="snake_game"></a>
        </div>

        <!-- Game 3 -->
        <div class="game">
            <h1>Puppy Jump</h1>
            <a href="./games/jump/jump.php"><img src="/images/title_images/puppy_jump.png" alt="puppy_jump_game"></a>
        </div>

        <!-- Game 4 -->
        <div class="game">
            <h1>Tetris DX</h1>
            <a href="games/tetris_dx/tetris_dx.php"><img src="images/title_images/tetris_dx.png" alt="tetris_dx_game"></a>
        </div>

        <!-- Game 5 -->
        <div class="game">
            <h1>Pac-Man</h1>
            <a href="games/pacman/pacman.php"><img src="images/title_images/pacman.png" alt="pac-man_game"></a>
        </div>

        <!-- Game 6 -->
        <div class="game">
            <h1>Flappy Matrix</h1>
            <a href="./games/flappy-matrix-master/flappymatrix.php"><img src="images/title_images/flappy.png" alt="flappy-matrix_game"></a>
        </div>

        <!-- Game 7 -->
        <div class="game">
            <h1>Space Invaders</h1>
            <a href="./games/space-invaders/space-invaders.php"><img src="images/title_images/space-invaders.png" alt="space-invaders_game"></a>
        </div>

        <!-- Game 8 -->
        <div class="game">
            <h1>Donkey Kong</h1>
            <a href="./games/donkey_kong/donkey_kong.php"><img src="images/title_images/donkey-kong.png" alt="donkey-kong_game"></a>
        </div>

        <!-- Game 9 -->
        <div class="game">
            <h1>Frogger</h1>
            <a href="./games/frogger/frogger.php"><img src="images/title_images/frogger.png" alt="frogger_game"></a>
        </div>

        <!-- Game 10 -->
        <div class="game">
            <h1>Asteroids!</h1>
            <a href="./games/asteroid/asteroid.php"><img src="images/title_images/asteroid.png" alt="asteroid_game"></a>
        </div>

        <!-- Game 11 -->
        <div class="game">
            <h1>Minesweeper</h1>
            <a href="./games/minesweeper/index.html"><img src="images/title_images/minesweeper.png" alt="minesweeper_game"></a>
        </div>

        <!-- Game 12 -->
        <div class="game">
            <h1>Duck Hunt</h1>
            <a href="./games/Duckhunt/title_screen.html"><img src="images/title_images/duckhunt.png" alt="duck_hunt_game"></a>
        </div>

        <!-- Game 13 -->
        <div class="game">
            <h1>Brick Breaker</h1>
            <a href="./games/brickbreaker/index.html"><img src="images/title_images/brickbreaker.png" alt="brick_breaker_game"></a>
        </div>

        <!-- Game 14 -->
        <div class="game">
            <h1>Crossing Game</h1>
            <a href="./games/Crossing-Game/index.html"><img src="images/title_images/crossing.png" alt="crossing_game"></a>
        </div>

        <!-- Game 15 -->
        <div class="game">
            <h1>Under Siege</h1>
            <a href="./games/under_siege/under_siege.php"><img src="images/title_images/under_siege.png" alt="under_siege_game"></a>
        </div>

        <!-- Game 16 -->
        <div class="game">
            <h1>Taco Bell Typer</h1>
            <a href="./games/tacobell/tacobell.html"><img src="images/title_images/tacobell.png" alt="tacobell_game"></a>
        </div>

        <!-- Game 17 -->
        <div class="game">
            <h1>Game Title 17</h1>
            <a href="#top"><img src="images/game_image.png" alt="game_image"></a>
        </div>

        <!-- Game 18 -->
        <div class="game">
            <h1>Game Title 18</h1>
            <a href="#top"><img src="images/game_image.png" alt="game_image"></a>
        </div>

    </div>
  </body>
</html>