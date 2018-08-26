"use strict";

function MouseController(sourceInput, player) {
  sourceInput.addEventListener("mousemove", this.onMouseMove.bind(this));
  sourceInput.addEventListener("mouseout", this.onMouseOut.bind(this));

  this.active = true;
  this.lastOffset = 0.0;
  this.acceleration = 0.0;
  this.currentVelocity = 0.0;
  this.playerObject = player;
}

Object.defineProperties(MouseController.prototype, {
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

  setOnGround: {
    value: function setOnGround() {
      if (this.lastOffset == 0.0) {
        this.acceleration = 0;
        this.currentVelocity = 0;
      }
      else {
        this.acceleration /= 2;
        this.currentVelocity /= 2;
      }
    }
  },

  onMouseMove: {
    value: function onMouseMove(evt) {
      // Normalize the current x position to the range [-1, 1]
      var width = evt.target.clientWidth;
      this.lastOffset = evt.clientX / width * 2 - 1;
    }
  },
  onMouseOut: {
    value: function onMouseOut(evt) {
      this.lastOffset = 0;
    }
  },

  update: {
    value: function update(elapsedTime) {
      if (this.active) {
        // Dead zone in range [-0.1, 0.1]
        // Movement zone scaled thereafter.
        if (Math.abs(this.lastOffset) > 0.1) {
          // Allow Super Mario Bros style quick turns
          if (this.lastOffset > 0 && this.acceleration < 0) {
            this.acceleration = 0.0;
          }
          else if (this.lastOffset < 0 && this.acceleration > 0) {
            this.acceleration = 0.0;
          }
          // From 0.1 to 0.5 we will scale our acceleration value
          this.acceleration = Math.clamp(-this.maxAccel, this.maxAccel, Math.min(this.lastOffset * 2, 1.0) * this.accelerationPerTick + this.acceleration);
        }
        else {
          // If we are in the dead zone then bleed off acceleration slowly.
          if (this.acceleration > 0) {
            this.acceleration = Math.max(0, this.acceleration - this.accelerationPerTick);
          }
          else if (this.acceleration < 0) {
            this.acceleration = Math.min(0, this.acceleration + this.accelerationPerTick);
          }
        }

        // Apply the acceleration
        this.currentVelocity = Math.clamp(-this.maxVelocity, this.maxVelocity, this.currentVelocity + this.acceleration);

        // Bleed off velocity if we no longer have an acceleration value
        if (this.acceleration === 0.0) {
          if (this.currentVelocity !== 0) {
            if (this.currentVelocity > 0) {
              this.currentVelocity = Math.max(0, this.currentVelocity - this.frictionPerTick);
            }
            else {
              this.currentVelocity = Math.min(0, this.currentVelocity + this.frictionPerTick);
            }
          }
        }

        this.playerObject.applyInput(this.currentVelocity);
      }
    }
  },
});