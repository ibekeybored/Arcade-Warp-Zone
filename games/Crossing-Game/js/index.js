/*******************************************
 *
 *
 *
 * Crossing Game
 * Author: Troy Malaki
 * COMP 491/L
 * Arcade Warp Zone
 *
 *
 *
 * *****************************************/

/********************
 *
 * MENU SREEEN
 *
 *******************/
class MenuScene extends Phaser.Scene {
  preload = function () {
    this.load.image("menuBG", "assets/menuBG.png");
    this.load.image("menu_text", "assets/menuText.png");
    this.load.image("instructions", "assets/instructions.png");
  };

  create = function () {
    this.bg = this.add.sprite(0, 0, "menuBG");
    // change origin to the top-left of the sprite
    this.bg.setOrigin(0, 0);
    this.bg.setScale(0.5);

    this.instructions = this.add.sprite(0, 0, "instructions");
    // change origin to the top-left of the sprite
    this.instructions.setOrigin(0, 0);
    this.instructions.setScale(0.8);

    this.text = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "menu_text"
    );
    // change origin to the top-left of the sprite
    this.text.setOrigin(0.5, 0.5);

    this.text.setScale(0.8);

    // Set initial rotation angle
    this.rotationAngle = 0;

    // Set up tweens for see-saw motion
    this.tweens.add({
      targets: this,
      rotationAngle: Math.PI / 8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  };

  update = function () {
    this.text.setRotation(this.rotationAngle);

    // Listen for space key press to start the game
    this.input.keyboard.once(
      "keydown-SPACE",
      function (event) {
        this.scene.start("LevelOne");
      },
      this
    );
  };
}

/********************
 *
 * First Level Scene
 *
 *******************/
class LevelOneScene extends Phaser.Scene {
  // some parameters for our scene
  init = function () {
    this.playerSpeed = 1.5;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
    this.reachedDoor = false;
  };

  // load asset files for our game
  preload = function () {
    // load images
    this.load.image("background", "assets/background0.png");
    this.load.image("walk1", "assets/playerGrey_walk1.png");
    this.load.image("enemy1", "assets/enemy1.png");
    this.load.image("enemy2", "assets/enemy2.png");
    this.load.image("enemy3", "assets/enemy3.png");
    this.load.image("enemy4", "assets/enemy4.png");
    this.load.image("enemy5", "assets/enemy5.png");
    this.load.image("exit0", "assets/door0.png");
  };

  // executed once, after assets were loaded
  create = function () {
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
      "exit0"
    );
    this.exit.setScale(0.6);

    this.isPlayerAlive = true;

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT");
  };

  // end the game
  gameOver = function () {
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
  update = function () {
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
        this.reachedDoor = true;
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
      this.reachedDoor = true;
      this.gameOver();
    }
    if (!this.isPlayerAlive) {
      return;
    }
  };
}

/********************
 *
 * Set up Phaser
 *
 *******************/
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
};

const game = new Phaser.Game(config);
game.scene.add("MenuKey", MenuScene);
game.scene.add("LevelOne", LevelOneScene);

game.scene.start("MenuKey");
