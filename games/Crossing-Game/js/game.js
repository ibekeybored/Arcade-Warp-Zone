/************************ 
 * 
 * Crossing Game
 * Author: Troy Malaki
 * COMP 491/L 
 * Arcade Warp Zone
 * 
 * *********************/

// create a new scene named "Game"
let gameScene = new Phaser.Scene("Game");
// our game's configuration
let config = {
  type: Phaser.AUTO, //Phaser will decide how to render our game (WebGL or Canvas)
  width: 640, // game width
  height: 360, // game height
  scene: gameScene, // our newly created scene
};
// create the game, and pass it the configuration
let game = new Phaser.Game(config);

// some parameters for our scene (our own customer variables - these are NOT part of the Phaser API)
gameScene.init = function () {
  this.playerSpeed = 1.5;
  this.enemyMaxY = 280;
  this.enemyMinY = 80;
};

let currBgNum = 0;
let currBG = "assets/background" + currBgNum + ".png";

// load asset files for our game
gameScene.preload = function () {
  // load images
  this.load.image("background", "assets/background1.png");
  // this.load.spritesheet('player', 'path/to/player_spritesheet.png', { 
  //   frameWidth: 640, frameHeight: 360
  // });
  this.load.image("walk1", "assets/playerGrey_walk1.png");
  this.load.image("walk2", "assets/playerGrey_walk2.png");
  this.load.image("walk3", "assets/playerGrey_walk3.png");
  this.load.image("enemy1", "assets/enemy1.png");
  this.load.image("enemy2", "assets/enemy2.png");
  this.load.image("enemy3", "assets/enemy3.png");
  this.load.image("enemy4", "assets/enemy4.png");
  this.load.image("enemy5", "assets/enemy5.png");
  this.load.image("exit", "assets/door1.png");
};

// executed once, after assets were loaded
gameScene.create = function () {
  // background
  let bg = this.add.sprite(0, 0, "background");
  // change origin to the top-left of the sprite
  bg.setOrigin(0, 0);

  // player
  this.player = this.add.sprite(40, this.sys.game.config.height / 2, "walk1");
  // scale down
  this.player.setScale(0.5);

  function genEnemyKey() {
    const randomNumber = Math.floor(Math.random() * 5) + 1; // Generates a random number between 1 and 5
    return "enemy" + randomNumber; // Concatenates "enemy" with the random number
  }

  // Array of enemy images
  var enemyImages = [
    genEnemyKey(),
    genEnemyKey(),
    genEnemyKey(),
    genEnemyKey(),
    genEnemyKey(),
  ];

  // group of enemies
  this.enemies = this.add.group({
    key: enemyImages,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20,
    },
  });
  // scale enemies
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

  // set speeds
  Phaser.Actions.Call(
    this.enemies.getChildren(),
    function (enemy) {
      enemy.speed = Math.random() * 2 + 1;
    },
    this
  );

  // goal
  this.exit = this.add.sprite(
    this.sys.game.config.width - 80,
    this.sys.game.config.height / 2,
    "exit"
  );
  this.exit.setScale(0.6);

  this.isPlayerAlive = true;

  this.keys = this.input.keyboard.addKeys("LEFT,RIGHT");
};

// end the game
gameScene.gameOver = function () {
  // flag to set player is dead
  this.isPlayerAlive = false;
  // shake the camera
  this.cameras.main.shake(500);
  // fade camera
  this.time.delayedCall(
    250,
    function () {
      this.cameras.main.fade(250);
    },
    [],
    this
  );
  // restart game
  this.time.delayedCall(
    500,
    function () {
      this.scene.restart();
    },
    [],
    this
  );
};

// executed on every frame (60 times per second)
gameScene.update = function () {  
  if (this.keys.RIGHT.isDown) {
    // player walks
    this.player.x += this.playerSpeed;
  } else if (this.keys.LEFT.isDown) {
    // player walks
    this.player.x -= this.playerSpeed;
  }

  // enemy movement and collision
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;
  for (let i = 0; i < numEnemies; i++) {
    // move enemies
    enemies[i].y += enemies[i].speed;
    // reverse movement if reached the edges
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }
    // enemy collision
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        enemies[i].getBounds()
      )
    ) {
      this.gameOver();
      break;
    }
  }

  // door collision
  if (
    Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.exit.getBounds()
    )
  ) {
    this.gameOver();
  }
  if (!this.isPlayerAlive) {
    return;
  }
};
