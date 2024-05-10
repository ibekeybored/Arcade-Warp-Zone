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

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Snake Game</title>
        <link rel="icon" type="image/x-icon" href="/images/logo.ico">
        <link rel="stylesheet" type="text/css" href="/css/styles.css">
        <style> /* CSS Styling */
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: black; /* Set the background color of the body to black */
            }

            #gameCanvas {
                border: 1px solid black;
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
        <canvas id="gameCanvas" width="600" height="600"></canvas>
        <script>
            // The addEventListener() method attaches an event handler to an element without overwriting existing event handlers.
            /*
            The addEventListener is being attached to the document. The event being listened for is the 'DOMContentLoaded' event.
            When this event occurs (i.e., when the HTML document has been fully loaded and parsed), the anonymous function (the callback function) specified as the second parameter to addEventListener is executed.
            This is a common practice to ensure that the script doesn't run until the HTML document is ready, which can prevent issues related to trying to manipulate elements that haven't been loaded yet.
            */
            document.addEventListener('DOMContentLoaded', function () { // Wait for the HTML document to be fully loaded before executing the script
                const canvas = document.getElementById('gameCanvas'); // Get a reference to the HTML canvas element with the id 'gameCanvas'
                const ctx = canvas.getContext('2d'); // Get a 2D rendering context for the canvas, allowing drawing operations
                const CELL_SIZE = 20;
                const GRID_SIZE = Math.floor(canvas.width / CELL_SIZE); // This calculation determines how many cells can fit horizontally in the canvas (and vertically since it assumes the height is the same as the width)

                let snake = [{ x: 0, y: 0 }]; // The variable snake is assigned an array with a single object as its element. The object has properties x and y, representing the positions of the snake's segments.
                let direction = null;
                let food = { x: 0, y: 0 }; // x and y are the positions
                let score = 0;
                let gameRunning = false;

                function draw() { // Draws all of the commodities, gets called every something miliseconds
                    // Clear the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // The clearRect() method clears specified pixels on the canvas.

                    // Set canvas background color to orange but you won't see it since there is a grid over this color
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw 1st part of grid, odd cells (if u count the first cell as 1)
                    ctx.fillStyle = 'lightblue';
                    for (let x = 0; x < GRID_SIZE; x++) {
                        for (let y = 0; y < GRID_SIZE; y++) {
                            if ((x + y) % 2 === 0) {
                                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                            }
                        }
                    }

                    // Draw 2nd part of grid, even cells (if u count the first cell as 1)
                    ctx.fillStyle = 'white';
                    for (let x = 0; x < GRID_SIZE; x++) {
                        for (let y = 0; y < GRID_SIZE; y++) {
                            if ((x + y) % 2 !== 0) {
                                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                            }
                        }
                    }

                    // Draws snake's rectangles in each of the position objects
                    ctx.fillStyle = 'green';
                    snake.forEach(segment => {
                        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    });

                    // Draws food based on what x and y currently is
                    ctx.fillStyle = 'red'; // The fillStyle property sets or returns the color, gradient, or pattern used to fill the drawing.
                    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                    // Draw score
                    ctx.fillStyle = 'black'; // Set the text color to white
                    ctx.font = '40px bold';
                    ctx.fillText('Score: ' + score, canvas.width / 2 - 80, 39);
                }

                function generateFood() { // Sets coordinates for the food object
                    food.x = Math.floor(Math.random() * GRID_SIZE);
                    food.y = Math.floor(Math.random() * GRID_SIZE);
                }

                function moveSnake() {
                    if (!gameRunning) {
                        return;
                    }

                    const head = Object.assign({}, snake[0]); // To create a shallow copy of the snake's head

                    switch (direction) { // whatever the direction is currently than it applies one of these conditions to the snake's position each time moveSnake() is called
                        case 'UP':
                            head.y -= 1;
                            break;
                        case 'DOWN':
                            head.y += 1;
                            break;
                        case 'LEFT':
                            head.x -= 1;
                            break;
                        case 'RIGHT':
                            head.x += 1;
                            break;
                    }

                    // Checks for collisions outside of the grid
                    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                        gameOver();
                        return;
                    }
                    /*
                      head.x < 0: Checks if the x-coordinate of the head is less than 0 (outside the left boundary).
                      head.x >= GRID_SIZE: Checks if the x-coordinate of the head is greater than or equal to the size of the grid (GRID_SIZE) (outside the right boundary).
                      head.y < 0: Checks if the y-coordinate of the head is less than 0 (outside the top boundary).
                      head.y >= GRID_SIZE: Checks if the y-coordinate of the head is greater than or equal to the size of the grid (GRID_SIZE) (outside the bottom boundary).
                    */

                    if (checkCollision(head.x, head.y)) { // Checks if the snakes head is the same position as one of its body parts
                        gameOver();
                        return;
                    }

                    // Checks if the snake touched food with its head
                    if (head.x === food.x && head.y === food.y) { // Since the tail will not be removed, the new head positiowill just be added in place where it would be which is where the apple is
                        score++;
                        generateFood();
                    } else { // Remove the tail
                        snake.pop();
                    }

                    // and push the new head with the new position infront of the current head of the snake or list
                    snake.unshift(head); // Unshift brings the element(s) inside to the beginning of the list

                    draw(); // The grid, the snake, the apple, and the score is redrawn again
                }

                function checkCollision(x, y) { // x and y will be the positions of the head and this returns true if any of the snake's body part is the same position as the head
                    return snake.some(segment => segment.x === x && segment.y === y);
                }

                function updateDatabase() {
                    // Use AJAX to make a POST request to the update_score.php script
                    const ajaxRequest = new XMLHttpRequest();
                    const url = '/games/update_score.php';
                    const params = 'game_name=Snake Apple Eater&user_id=' + <?php echo $userID?> +'&score=' + score;

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

                function gameOver() {
                    // Function to update database with user score
                    updateDatabase();
                    alert('Game Over!\nYour Score: ' + score);
                    resetGame();
                }

                function resetGame() { // Resets the game
                    snake = [{ x: 0, y: 0 }];
                    direction = null;
                    score = 0;
                    gameRunning = false;
                    generateFood();
                    draw();
                }

                function handleKeyPress(event) {
                    if (!gameRunning) { // Pressing a keyboard key allows moveSnake() to execute the rest of its code
                        gameRunning = true;
                    }

                    const newDirection = (() => { // Retruns a String Object and the IIFE does not take any arguements amd the anonymous function is invoked immediatley
                        switch (event.key) {
                            case 'ArrowUp':
                                return 'UP';
                            case 'ArrowDown':
                                return 'DOWN';
                            case 'ArrowLeft':
                                return 'LEFT';
                            case 'ArrowRight':
                                return 'RIGHT';
                            default:
                                return null;
                        }
                    })();

                    // Check if the new direction is not opposite to the current direction, if not assign it to the current direction
                    if (newDirection && !isOppositeDirection(newDirection, direction)) {
                        direction = newDirection;
                    }
                }

                function isOppositeDirection(newDirection, currDirection) { // returns true if the direction is opposite
                    return (newDirection === 'LEFT' && currDirection === 'RIGHT') ||
                        (newDirection === 'RIGHT' && currDirection === 'LEFT') ||
                        (newDirection === 'UP' && currDirection === 'DOWN') ||
                        (newDirection === 'DOWN' && currDirection === 'UP');
                }

                // Set up initial game state
                generateFood();
                draw();

                // Set up keyboard input
                document.addEventListener('keydown', handleKeyPress);

                // Sets up a game loop where the moveSnake function is called every 100 miliseconds
                setInterval(moveSnake, 100);
            });

            // Notes:
            /*
            The fillRect () method draws a "filled" rectangle:
              Syntax
                context.fillRect(x, y, width, height)
              Parameter Values
                x	The x-coordinate of the upper-left corner of the rectangle
                y	The y-coordinate of the upper-left corner of the rectangle
                width	The width of the rectangle, in pixels
                height	The height of the rectangle, in pixels


            Object.assign(source, target, ...) - Copies all stuff from the targets and merges it with the source and then returns the instance of source with the modifications.

                const target = { a: 1, b: 2 };
                const source = { b: 4, c: 5 };

                const returnedTarget = Object.assign(target, source);

                console.log(target);
                // Expected output: Object { a: 1, b: 4, c: 5 }

                console.log(returnedTarget === target);
                // Expected output: true

                Object.assign(target, source1, source2, …, sourceN)


            The some() method checks if any array elements pass a test (provided as a callback function).
              The some() method executes the callback function once for each array element.

              The some() method returns true (and stops) if the function returns true for one of the array elements.

              The some() method returns false if the function returns false for all of the array elements.

              The some() method does not execute the function for empty array elements.

              The some() method does not change the original array.

                const ages = [3, 10, 18, 20, 30];

                ages.some(checkAdult);
                function checkAdult(age) {
                  return age > 18;
                }

                // It will return true on 20 and will not call the function for subsequent elements and in this case, 30

            */
        </script>
    </body>
</html>
