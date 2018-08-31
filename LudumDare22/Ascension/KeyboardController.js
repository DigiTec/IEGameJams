"use strict";

function KeyboardController(sourceInput, player) {
  sourceInput.addEventListener("keyup", this.onKeyUp.bind(this));
  sourceInput.addEventListener("keydown", this.onKeyDown.bind(this));

  this.active = true;
  this.keyLeft = false;
  this.keyRight = false;
  this.acceleration = 0;
  this.currentVelocity = 0;
  this.playerObject = player;
}

Object.defineProperties(KeyboardController.prototype, {
  accelerationPerTick: {
    value: 0.1,
    writable: false
  },
  frictionPerTick: {
    value: 0.1,
    writable: false
  },
  maxVelocity: {
    value: 6,
    writable: false
  },
  maxAccel: {
    value: 2,
    writable: false
  },
  latency: {
    value: 1,
    writable: false
  },

  setOnGround: {
    value: function setOnGround() {
      if (!this.keyLeft && !this.keyRight) {
        this.acceleration = 0;
        this.currentVelocity = 0;
      } else {
        this.acceleration /= 2;
        this.currentVelocity /= 2;
      }
    }
  },
  onKeyDown: {
    value: function onKeyDown(evt) {
      // console.log("onKeyDown");
      this.setKeyState(evt.key || evt.keyIdentifier, true);
    }
  },
  onKeyUp: {
    value: function onKeyUp(evt) {
      // console.log("onKeyUp");
      this.setKeyState(evt.key || evt.keyIdentifier, false);
    }
  },
  setKeyState: {
    value: function setKeyState(keyBind, newValue) {
      switch (keyBind) {
        case "ArrowLeft":
        case "Left":
          this.keyLeft = newValue;
          break;
        case "ArrowRight":
        case "Right":
          this.keyRight = newValue;
          break;
      }
    }
  },
  update: {
    value: function update(elapsedTime) {
      if (this.active) {
        if (this.keyLeft && !this.keyRight) {
          if (this.acceleration > 0) {
            this.acceleration = 0;
          }
          this.acceleration = Math.clamp(
            -this.maxAccel,
            this.maxAccel,
            this.acceleration - this.accelerationPerTick
          );
        } else if (this.keyRight && !this.keyLeft) {
          if (this.acceleration < 0) {
            this.acceleration = 0;
          }
          this.acceleration = Math.clamp(
            -this.maxAccel,
            this.maxAccel,
            this.acceleration + this.accelerationPerTick
          );
        } else {
          // Bleed off acceleration if both keys or no keys are pressed.
          if (this.acceleration > 0) {
            this.acceleration = Math.max(
              0,
              this.acceleration - this.accelerationPerTick
            );
          } else if (this.acceleration < 0) {
            this.acceleration = Math.min(
              0,
              this.acceleration + this.accelerationPerTick
            );
          }
        }

        // Apply the acceleration
        this.currentVelocity = Math.clamp(
          -this.maxVelocity,
          this.maxVelocity,
          this.currentVelocity + this.acceleration
        );

        // Bleed off velocity
        if (this.currentVelocity > 0) {
          this.currentVelocity =
            Math.max(0, this.currentVelocity - this.frictionPerTick) *
            this.latency;
        } else if (this.currentVelocity < 0) {
          this.currentVelocity =
            Math.min(0, this.currentVelocity + this.frictionPerTick) *
            this.latency;
        }

        this.playerObject.applyInput(this.currentVelocity);
      }
    }
  }
});
