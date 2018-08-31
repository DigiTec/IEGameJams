/// <reference path="LevelManager.js" />
/// <reference path="Game.js"/>
/// <reference path="GameCam.js"/>

"use strict";
function Player(gameEngine, x, y) {
  this.onGround = true;
  this.superJump = false;
  this.superJumpTimer;
  this.bounceVelocity = 0;
  this.gameEngine = gameEngine;

  this.x = x === undefined ? 0 : x;
  this.y = y === undefined ? 10 : y;
  this.curY = this.y;

  this.width = this.gameEngine.scl;
  this.height = this.gameEngine.scl;

  this.scl = this.gameEngine.scl;
  this.animHeight = 0;
  this.animInterp = 0.07;

  this.keyboardController = new KeyboardController(window, this);
  this.mouseController = new MouseController(
    document.getElementById("inputManager"),
    this
  );

  this.mesh = Mesh.CreateTexturedAlphaSquareMesh(
    "shader-vs-texture",
    "shader-fs-texture",
    ASSETS_RELATIVE_PATH + "/InternetExplorerLogo.512x512.png"
  );

  this.decelerationPerTick = Player.decelerationPerTick;
  this.maxVelocity = Player.maxVelocity;
  this.vec2Dir = [0, 1]; // 2d direction

  this.viewXMin = this.gameEngine.viewXMin;
  this.viewXMax = this.gameEngine.viewXMax;

  this.latency = Player.latency;
}

Object.defineProperties(Player, {
  decelerationPerTick: {
    value: 1,
    writable: false
  },
  maxVelocity: {
    value: 75,
    writable: false
  },
  maxX: {
    value: 240,
    writable: false
  },
  latency: {
    value: 1,
    writable: false
  }
});

Object.defineProperties(Player.prototype, {
  applyInput: {
    value: function applyInput(velocity) {
      if (this.onGround) {
        // On the ground we can't move
      } else {
        // Wrap player on other side of screen
        this.x += velocity;

        if (velocity === 0) this.vec2Dir[0] = 0;
        else this.vec2Dir[0] = velocity > 0 ? 1 : -1; // extract direction

        if (this.x > this.viewXMax) {
          this.x = this.viewXMin;
        } else if (this.x < this.viewXMin) {
          this.x = this.viewXMax;
        }
      }
    }
  },
  applyPlatform: {
    value: function applyPlatform(y, action) {
      // Reset us on the ground
      this.y = y;
      this.curY = this.y;
      this.onGround = true;

      if (this.keyboardController) {
        this.keyboardController.setOnGround();
      }

      switch (action) {
        case PlatformAction.DIE:
          this.gameEngine.die();
          break;
        case PlatformAction.FAST_BOUNCE:
        case PlatformAction.BUBBLE_BOUNCE:
        case PlatformAction.CONTINUE:
        case PlatformAction.NORMAL_BOUNCE:
          break;
      }
    }
  },
  updateKinematics: {
    value: function updateKinematics(elapsedTime) {
      if (this.onGround) {
        this.animHeight = this.scl * 0.5;
        this.onGround = false;

        // We need to bounce, but we need to do it based on the type of platform we are on.
        if (this.superJump) {
          this.superJump = false;
          this.superJumpTimer = DateTime.now;
          this.bounceVelocity = this.maxVelocity;
        } else if (Date.now - this.superJumpTimer < 2000) {
          // We let the bounceVelocity continue
        } else {
          this.bounceVelocity = this.maxVelocity / 2;
        }
      } else {
        // Applying gravity
        this.bounceVelocity = Math.max(
          -this.maxVelocity,
          this.bounceVelocity - this.decelerationPerTick
        );
      }
      this.y += this.bounceVelocity * this.latency;
      this.vec2Dir[1] = this.bounceVelocity > 0 ? 1 : -1; // extract direction
      //console.log(this.y);
    }
  },
  updateInput: {
    value: function updateInput(timeElapsed) {
      this.keyboardController.update(timeElapsed);
      this.mouseController.update(timeElapsed);
    }
  },
  update: {
    value: function update(timeElapsed) {
      this.updateInput(timeElapsed);
      this.updateKinematics(timeElapsed);

      // Image Height of player interp
      this.animHeight += (this.scl - this.animHeight) * this.animInterp;

      // If we fall under camera view, the we restart the game
      // TODO:  if out of lives go back to MainMenu.
      if (this.gameEngine.gamecam.isUnderView(this.y, this.scl)) {
        this.gameEngine.game.GameStateMgr.setState("InGame");
      }
    }
  },
  draw: {
    value: function draw() {
      //console.log(this.y);
      this.mesh.transform.scale(this.scl, this.animHeight, 0.0);
      this.mesh.transform.translate(this.x, this.y, 0);
      this.mesh.draw();
    }
  }
});
