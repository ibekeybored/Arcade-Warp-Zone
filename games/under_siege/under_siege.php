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
        <title>Under Siege</title>
        <link rel="icon" type="image/x-icon" href="/images/logo.ico">
        <link rel="stylesheet" type="text/css" href="/css/styles.css">
        <style>
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: black; /* Set the background color of the body to black */
            }

            #gameCanvas {
                margin-top: 100px;
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
        <iframe id="gameCanvas" frameborder="0" src="https://itch.io/embed-upload/10387451?color=743f39" allowfullscreen="" width="1010" height="670"><a href="https://willowherb.itch.io/under-siege">Play Under Siege on itch.io</a></iframe>
    </body>
</html>
