<?php
// Start Session
session_start();

// Check if the user is not authenticated
if (!isset($_SESSION['username'])) {
    header("Location: /login.html");
    exit();
}else{
    $currentUser = $_SESSION['username'];

    // Database variables and information
    $host = "arcadewarpzone.ccaow2uqh8ko.us-west-1.rds.amazonaws.com";
    $db_username = "admin";
    $db_password = "awz12345+";
    $db = "awz";

    // Establish a database connection
    $conn = new mysqli($host, $db_username, $db_password, $db);

    // Check if the connection was successful
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Select userId from the table users where username == $currentuser
    $getUserIDQuery = "SELECT user_id FROM users WHERE username = '$currentUser'";
    $result = $conn->query($getUserIDQuery);

    // Check for errors in the query
    if (!$result) {
        echo "Error getting user ID: " . $conn->error;
        exit();
    }

    // Use the userID and fetch_assoc to get the result
    $userData = $result->fetch_assoc();
    $userID = $userData['user_id'];

    // Close the database connection
    $conn->close();
}

?>

<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Flappy Matrix</title>
        <link rel="icon" type="image/x-icon" href="/images/logo.ico">
        <link rel="stylesheet" type="text/css" href="/css/styles.css">
        <style>
            #flappyboard {
                background-image: url("/games/flappy-matrix-master/bg.jpg");
            }
        </style>
    </head>
    <body>
        <div class=header>
            <div class="logo">
                <a id="logo" href="/dashboard.php"><img src="/images/logo.png" alt="logo"></a>
            </div>
            <div class="navbar">
                <a href="/dashboard.php">User Dashboard</a>
                <a href="/games.php">Games</a>
                <a href="/logout.php">Logout</a>
            </div>
        </div>
        <div id="background-container">
            <video autoplay muted loop playsinline>
                <source src="/videos/stars.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
        <div id="game_canvas" style="display: flex; justify-content: center; align-items: center;">
            <canvas id="flappyboard"></canvas>
        </div>
        <script>
            //Board
            let board;
            let boardWidth = 360;
            let boardHeight = 640;
            let context;

            //Neo
            let neoWidth = 34;
            let neoHeight = 24;
            let neoX = boardWidth/8;
            let neoY = boardHeight/2;
            let neoImg;
            let neo = {
                x : neoX,
                y : neoY,
                width : neoWidth,
                height : neoHeight
            }

            //Pills
            let pillArray = [];
            let pillWidth = 64;
            let pillHeight = 512;
            let pillX = boardWidth;
            let pillY = 0;
            let topPillImg;
            let bottomPillImg;

            //Gravity and Velocity
            let velocityX = -2; //Pills moving left speed
            let velocityY = 0; //Neo jump speed
            let gravity = 0.2;

            //Game
            let gameOver = false;
            let score = 0;

            //Load game
            window.onload = function() {
                board = document.getElementById("flappyboard");
                board.height = boardHeight;
                board.width = boardWidth;
                context = board.getContext("2d");

                //Load images
                neoImg = new Image();
                neoImg.src = "./neo.jpg";
                neoImg.onload = function() {
                    context.drawImage(neoImg, neo.x, neo.y, neo.width, neo.height);
                }

                topPillImg = new Image();
                topPillImg.src = "./blue1.jpg";

                bottomPillImg = new Image();
                bottomPillImg.src = "./blue1.jpg";

                gameOverImg = new Image();
                gameOverImg.src = "./agentsmith.jpg";

                requestAnimationFrame(update);
                setInterval(placePills, 1500);
                document.addEventListener("keydown", moveNeo);
            }

            function update() {
                requestAnimationFrame(update);
                if (gameOver) {
                    return;
                }
                context.clearRect(0, 0, board.width, board.height);

                //Neo physics
                velocityY += gravity;
                neo.y = Math.max(neo.y + velocityY, 0);
                context.drawImage(neoImg, neo.x, neo.y, neo.width, neo.height);

                if (neo.y > board.height) {
                    gameOver = true;
                    updateDatabase();
                }

                //Pill physics
                for (let i = 0; i < pillArray.length; i++) {
                    let pill = pillArray[i];
                    pill.x += velocityX;
                    context.drawImage(pill.img, pill.x, pill.y, pill.width, pill.height);

                    if (!pill.passed && neo.x > pill.x + pill.width) {
                        score += 0.5;
                        pill.passed = true;
                    }

                    if (detectCollision(neo, pill)) {
                        gameOver = true;
                        updateDatabase();
                    }
                }

                //Clear Pills
                while (pillArray.length > 0 && pillArray[0].x < -pillWidth) {
                    pillArray.shift();
                }

                //Score
                context.fillStyle = "red";
                context.font="45px sans-serif";
                context.fillText(score, 5, 45);

                if (gameOver) {
                    context.fillText("GAME OVER", 43, 90);
                    context.drawImage(gameOverImg, 20, 100);
                }
            }

            function placePills() {
                if (gameOver) {
                    return;
                }

                let randomPillY = pillY - pillHeight/4 - Math.random()*(pillHeight/2);
                let opening = board.height/4;

                let topPill = {
                    img : topPillImg,
                    x : pillX,
                    y : randomPillY,
                    width : pillWidth,
                    height : pillHeight,
                    passed : false
                }
                pillArray.push(topPill);

                let bottomPill = {
                    img : bottomPillImg,
                    x : pillX,
                    y : randomPillY + pillHeight + opening,
                    width : pillWidth,
                    height : pillHeight,
                    passed : false
                }
                pillArray.push(bottomPill);
            }

            function moveNeo(e) {
                if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
                    //Jump
                    velocityY = -6;

                    //Reset game
                    if (gameOver) {
                        neo.y = neoY;
                        pillArray = [];
                        score = 0;
                        gameOver = false;
                    }
                }
            }

            function detectCollision(a, b) {
                return a.x < b.x + b.width &&
                    a.x + a.width > b.x &&
                    a.y < b.y + b.height &&
                    a.y + a.height > b.y;
            }

            // Function to update database with user score
            function updateDatabase() {
                // AJAX to make a POST request to the update_score.php script
                const ajaxRequest = new XMLHttpRequest();
                const url = '/games/update_score.php';
                const params = 'game_name=Flappy Matrix&user_id=' + <?php echo $userID?> +'&score=' + score;

                ajaxRequest.open('POST', url, true);
                ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                ajaxRequest.onreadystatechange = function () {
                    if (ajaxRequest.readyState === 4 && ajaxRequest.status === 200) {
                        console.log(ajaxRequest.responseText);
                    }
                };

                // Send the request
                ajaxRequest.send(params);
            }
        </script>
    </body>
</html>