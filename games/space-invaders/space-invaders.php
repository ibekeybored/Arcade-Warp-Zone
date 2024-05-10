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
    <title>Space Invaders</title>
    <link rel="icon" type="image/x-icon" href="/images/logo.ico">
    <link rel="stylesheet" type="text/css" href="/css/styles.css">
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
<div id="game_canvas" style="display: flex; justify-content: center; align-items: center; background: #08040F;">
    <p
        style ="position: absolute; z-index: 10; color: white; left: 15px;
		top: 10px; margin: 0; font-family: monospace; font-size: 22px"
    >
        <span>Controls</span>
    </p>

    <p
        style ="position: absolute; z-index: 10; color: white; left: 15px;
		top: 30px; margin: 0; font-family: monospace; font-size: 22px"
    >
        <span>Left: A / Right: D / Shoot: Spacebar</span>
    </p>


    <div style="position: relative;">
        <p
            style ="position: absolute; z-index: 10; color: white; left: 15px;
		top: 10px; margin: 0; font-family: monospace; font-size: 23px"
        >
            <span>Score:</span> <span id="scoreEl">0</span>
        </p>
        <canvas style="border: solid white 2px;"></canvas>
    </div>
    <script src="../space-invaders/index.js"></script>
</div>
</body>
</html>
