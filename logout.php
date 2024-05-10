
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
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Delete cookies and other data
setcookie(session_name(), '', 100);
session_unset();

// Redirect to the login page or any other page after logout
header("Location: login.html");
exit();
