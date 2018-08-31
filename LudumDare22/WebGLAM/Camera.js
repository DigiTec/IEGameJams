//TODO: Implement a real camera
// Object definition
function Camera(drawDistance) {
  this.transform = new Transform();
  WEBGLAM.camera = this; // Allow for global access.

  this.fov = 45.0;

  this.drawDistance = drawDistance;
  if (typeof this.drawDistance === "undefined") {
    this.drawDistance = 2000.0;
  }

  this.isAtanFovHalfCalculated = false;
  this.atanFovHalf = null;
}

// Statics
Object.defineProperties(Camera, {
  CreateCamera: {
    value: function CreateCamera() {
      var cam = new Camera();

      return cam;
    }
  }
});

// Instance methods
Object.defineProperties(Camera.prototype, {
  getAtanFovHalf: {
    value: function getAtanFovHalf() {
      if (!this.isAtanFovHalfCalculated) {
        this.atanFovHalf = Math.atan(DegToRad(this.fov * 0.5));
        this.isAtanFovHalfCalculated = true;
      }
      return this.atanFovHalf;
    }
  },
  getViewTopHeight: {
    value: function viewTopHeight() {
      return Math.abs(this.getAtanFovHalf() * this.transform.pos[2]);
    }
  },
  getZToMatchPixelsDimension: {
    value: function getDistanceToMatchPixelsDimension() {
      return Math.abs(WEBGLAM.viewport.height / this.getAtanFovHalf());
    }
  },
  setFov: {
    value: function setFov(newFov) {
      this.fov = newFov;
      this.isAtanFovHalfCalculated = false;
    }
  },
  draw: {
    value: function draw() {
      // Allow for global access.
      WEBGLAM.camera = this;

      gl.clearColor(0.0, 0.4, 0.7, 1.0);
      gl.enable(gl.DEPTH_TEST);

      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      mat4.perspective(
        this.fov,
        gl.viewportWidth / gl.viewportHeight,
        0.1,
        this.drawDistance,
        pMatrix
      );

      this.transform.applyInverse();

      this.transform.transf[14] *= -1;
      camMatrix = this.transform.transf;
    }
  }
});
