/// <reference path="Player.js" />

//
// Constants that tell the player what happens when a platform is hit
//
function PlatformAction() {}

// Statics
Object.defineProperties(PlatformAction, {
  CONTINUE: {
    value: 0,
    writable: false
  },
  NORMAL_BOUNCE: {
    value: 1,
    writable: false
  },
  FAST_BOUNCE: {
    value: 2,
    writable: false
  },
  DIE: {
    value: 3,
    writable: false
  },
  BUBBLE_BOUNCE: {
    value: 4,
    writable: false
  },
  HEIGHT_BOUNCE: {
    value: 100,
    writable: false
  }
});

function PlatformProperties() {}

// Statics
Object.defineProperties(PlatformProperties, {
  COLOR_DEFAULT: {
    value: [1.0, 0.0, 0.0],
    writable: false
  },
  WIDTH_DEFAULT: {
    value: 4,
    writable: false
  },
  HEIGHT_BOUNCE: {
    value: 400,
    writable: false
  }
});

//
// Base platform class
//
function Platform(x, y, width, vec3Color) {
  this.x = x;
  this.y = y;
  this.width =
    typeof width === "undefined" ? PlatformProperties.WIDTH_DEFAULT : width;
  this.height = this.scl = 35;
  ///TODO: Update based on how much a player can bounce
  this.bounceHeight =
    typeof heightBounce === "undefined"
      ? PlatformProperties.HEIGHT_BOUNCE
      : heightBounce;
  this.isMoving = false;
  this.exist = true;
  this.vec3Color =
    typeof vec3Color === "undefined"
      ? PlatformProperties.COLOR_DEFAULT
      : vec3Color;
}

Object.defineProperties(Platform.prototype, {
  hit: {
    value: function hit() {
      return PlatformAction.NORMAL_BOUNCE;
    }
  }
});

//
// Platform type: Normal
// Description:   Player bounces at normal speed
//
function NormalPlatform() {}

NormalPlatform.prototype = Object.create(Platform.prototype);
NormalPlatform.prototype.constructor = NormalPlatform;

//
// Platform type: Skinny
// Description: Width of platform is less than other platforms
//
function SkinnyPlatform() {}

SkinnyPlatform.prototype = Object.create(Platform.prototype);
SkinnyPlatform.prototype.constructor = SkinnyPlatform;

Object.defineProperties(SkinnyPlatform.prototype, {
  width: {
    value: 41,
    writable: false
  }
});

//
// Platform type: Bubble
// Description: When the player bounces it moves erraically in x while going up
//
function BubblePlatform() {}

BubblePlatform.prototype = Object.create(Platform.prototype);
BubblePlatform.prototype.constructor = BubblePlatform;

Object.defineProperties(BubblePlatform.prototype, {
  color: {
    value: "pink",
    writable: false
  },
  hit: {
    value: function hit() {
      return PlatformAction.BUBBLE_BOUNCE;
    }
  }
});

//
// Platform type: Death
// Description: Player dies if collides with the platform
//
function DeathPlatform() {}

DeathPlatform.prototype = Object.create(Platform.prototype);
DeathPlatform.prototype.constructor = DeathPlatform;

Object.defineProperties(DeathPlatform.prototype, {
  color: {
    value: "red",
    writable: false
  },
  hit: {
    value: function hit() {
      return PlatformAction.DIE;
    }
  }
});

//
// Platform type: Super Jump
// Description: Player moved up at twice the normal speed
//
function SuperJumpPlatform() {}

SuperJumpPlatform.prototype = Object.create(Platform.prototype);
SuperJumpPlatform.prototype.constructor = SuperJumpPlatform;

Object.defineProperties(SuperJumpPlatform.prototype, {
  ///TODO: Update based on how much a player can bounce
  bounceHeight: {
    value: 1000,
    writable: false
  },
  hit: {
    value: function hit() {
      return PlatformAction.FAST_BOUNCE;
    }
  }
});

//
// Platform type: Fade
// Description: Platform disappears after the player comes in contact with it
//
function FadePlatform() {}

FadePlatform.prototype = Object.create(Platform.prototype);
FadePlatform.prototype.constructor = FadePlatform;

Object.defineProperties(FadePlatform.prototype, {
  color: {
    value: "gray",
    writable: false
  },
  hit: {
    value: function hit() {
      this.exist = false;

      return PlatformAction.NORMAL_BOUNCE;
    }
  }
});

//
// Class that generates the platforms and performs collision detection
//
function LevelManager(gameEngine) {
  // Store a reference to the game engine
  this.gameEngine = gameEngine;

  // store the value of the current upper y limit so tha we don't regenerate platforms
  //  if the camera has not moved.
  // note: this assumes that the camera never goes down
  this.currentUpperY = 0;

  // store the values of the x boundaries
  this.minX = this.gameEngine.viewXMin;
  this.maxX = this.gameEngine.viewXMax;
  this.deltaX = this.maxX - this.minX;

  // cache of the platforms for the most recent camera view port request
  this.platforms = new Array();

  this.meshPlatform = Mesh.CreateTexturedAlphaSquareMesh(
    "shader-vs-texture",
    "shader-fs-texture",
    ASSETS_RELATIVE_PATH + "/Circle.png"
  );

  this.meshCloud = Mesh.CreateTexturedAlphaSquareMesh(
    "shader-vs-texture",
    "shader-fs-texture",
    ASSETS_RELATIVE_PATH + "/Cloud.png"
  );
  this.clouds = new Array();
  var sclClouds = this.gameEngine.scl * 3;
  for (
    var i = 0;
    i < this.gameEngine.levelHeight;
    i += Math.random() * 300 + 200
  ) {
    this.clouds.push({
      x: this.minX + Math.random() * this.deltaX,
      y: i,
      z: -(Math.random() * 100 + 100),
      scl: Math.random() * sclClouds + sclClouds * 0.5,
      brightness: Math.random() * 0.3 + 0.7
    });
  }
}

Object.defineProperties(LevelManager.prototype, {
  // Array of all existing platform types
  platformTypes: {
    value: [
      "NormalPlatform",
      "SkinnyPlatform",
      "BubblePlatform",
      "SuperJumpPlatform",
      "FadePlatform",
      "DeathPlatform"
    ],
    writable: false
  },
  //
  // LEVEL DESIGN - DISTANCE BETWEEN PLATFORMS (part 1 of 2)
  // Returns the next Y based on the Y of the previous platform
  //  and the bounce height of the previous platform
  //
  getNextYDelta: {
    value: function getNextYDelta(previousPlatform) {
      return previousPlatform.bounceHeight;
    }
  },
  //
  // Given the existing platforms, add platforms as needed to cover the region
  //  defined by the lower and upper y bounds
  //
  generatePlatforms: {
    value: function generatePlatforms(lowerY, upperY) {
      for (
        var curY = lowerY;
        curY < upperY;
        curY += this.getNextYDelta(this.platforms[this.platforms.length - 1])
      ) {
        this.platforms.push(
          new Platform(this.minX + Math.random() * this.deltaX * 0.6, curY, 4, [
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5
          ])
        );
      }
    }
  },
  //
  // Check if the player collided with any of the platforms in the view port and return
  //  the action that corresponds to the platform type
  //
  checkForPlayerCollision: {
    value: function checkForPlayerCollision(player) {
      // only check for collision if the player is at the top of a jump (bounceVelocity = 0) or going down
      if (player.bounceVelocity <= 0) {
        // verify collision
        var playerCollisionBox = {
          centerX: player.x,
          centerY: player.y - player.bounceVelocity * 0.5,
          width: player.width,
          height: player.bounceVelocity
        };

        // check for collision against platforms in the viewport
        for (var i = 0; i < this.platforms.length; i++) {
          var platformCollisionBox = {
            centerX: this.platforms[i].x,
            centerY: this.platforms[i].y + this.platforms[i].height * 0.5,
            width: this.platforms[i].width * 2 * this.platforms[i].scl,
            height: this.platforms[i].height * 2
          };

          if (this.boxesOverlap(playerCollisionBox, platformCollisionBox)) {
            return { y: this.platforms[i].y, action: this.platforms[i].hit() };
          }
        }
      }

      return { y: 0, action: PlatformAction.CONTINUE };
    }
  },
  //
  // Helper funtion to determine if two boxes overlap each other
  //
  boxesOverlap: {
    value: function boxesOverlap(box1, box2) {
      // overlap = (distance between centers) <= sum of the radious of both boxes
      var xOverlap =
        Math.abs(box1.centerX - box2.centerX) <
        (Math.abs(box1.width) + Math.abs(box2.width)) * 0.5;
      var yOverlap =
        Math.abs(box1.centerY - box2.centerY) <
        (Math.abs(box1.height) + Math.abs(box2.height)) * 0.5;

      return xOverlap && yOverlap;
    }
  },
  //
  // Return the platforms in the given y range and generate them if they have not been generated
  //
  update: {
    value: function update() {}
  },
  draw: {
    value: function draw() {
      var i;
      for (i = 0; i < this.clouds.length; i++) {
        if (
          !this.gameEngine.gamecam.isInView(
            this.clouds[i].y,
            this.clouds[i].scl * 1.5
          )
        )
          continue;
        this.meshCloud.transform.translate(
          this.clouds[i].x,
          this.clouds[i].y,
          this.clouds[i].z
        );
        this.meshCloud.transform.scale(
          this.clouds[i].scl,
          this.clouds[i].scl,
          1.0
        );
        this.meshCloud.setRGBA(
          this.clouds[i].brightness,
          this.clouds[i].brightness,
          this.clouds[i].brightness,
          1.0
        );
        this.meshCloud.draw();
      }

      for (i = 0; i < this.platforms.length; i++) {
        if (
          !this.gameEngine.gamecam.isInView(
            this.platforms[i].y,
            this.clouds[i].scl
          )
        )
          continue;
        this.drawPlatform(this.platforms[i]);
      }
    }
  },
  drawPlatform: {
    value: function drawPlatform(platform) {
      var widthHalf = platform.width * 0.5;

      var scl = this.gameEngine.scl;

      this.meshPlatform.transform.scale(platform.scl, platform.scl, 1);

      var y = platform.y - platform.height;
      for (var i = -widthHalf; i < widthHalf; ++i) {
        var x = platform.x + i * platform.scl * 2;

        this.meshPlatform.transform.translate(x, y, 0);
        this.meshPlatform.setRGBA(
          platform.vec3Color[0],
          platform.vec3Color[1],
          platform.vec3Color[2],
          1.0
        );
        this.meshPlatform.draw();
      }
    }
  }
});

// Generate an integer between min (inclusive) and max (inclusive)
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

////////////// TEST METHODS ////////////////////
/*function drawPlatform(platform) {
    var line = "[" + platform.y + "]";

    for (var i = 0; i < platform.x - Math.floor(platform.width / 2) ; i++) {
        line += " ";
    }

    if (platform instanceof NormalPlatform) {
        line += "TTTT";
    } else if (platform instanceof SkinnyPlatform) {
        line += "---";
    } else if (platform instanceof BubblePlatform) {
        line += "OOOOO";
    } else if (platform instanceof DeathPlatform) {
        line += "XXXXX";
    } else if (platform instanceof FadePlatform) {
        line += "*****";
    } else if (platform instanceof SuperJumpPlatform) {
        line += "^^^^^";
    } else {
        line += "ERR";
    }

    console.log(line);
}

var lmanager = new LevelManager(0, 80);

function test(lowerY, upperY) {
    var platforms = lmanager.getPlatforms(lowerY, upperY);

    var maxY = platforms[platforms.length - 1].y;
    var currentPlatformIndex = platforms.length - 1;

    for (var i = upperY; i > lowerY; i--) {
        if (currentPlatformIndex > -1 && platforms[currentPlatformIndex].y == i) {
            drawPlatform(platforms[currentPlatformIndex--]);
        }
        else {
            console.log("[" + i + "]");
        }
    }

    console.log("Done");
}


*/
