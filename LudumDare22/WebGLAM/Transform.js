"use strict";
function Transform() {
  this.transf = mat4.create();

  this.pos = [0.0, 0.0, 0.0];
  this.rot = [0.0, 0.0, 0.0];
  this.scl = [1.0, 1.0, 1.0];

  this.isTransformApplied = false;
}

// Instance methods
Object.defineProperties(Transform.prototype, {
  translate: {
    value: function translate(x, y, z) {
      this.pos = [x, y, z];
      this.isTransformApplied = false;
    }
  },
  rotate: {
    value: function rotate(rx, ry, rz) {
      this.rot = [rx, ry, rz];
      this.isTransformApplied = false;
    }
  },
  scale: {
    value: function scale(sx, sy, sz) {
      this.scl = [sx, sy, sz];
      this.isTransformApplied = false;
    }
  },
  apply: {
    value: function apply() {
      if (this.isTransformApplied) return;

      mat4.identity(this.transf);

      mat4.translate(this.transf, this.pos);
      mat4.rotate(this.transf, this.rot[0], [1.0, 0.0, 0.0]);
      mat4.rotate(this.transf, this.rot[1], [0.0, 1.0, 0.0]);
      mat4.rotate(this.transf, this.rot[2], [0.0, 0.0, 1.0]);
      mat4.scale(this.transf, this.scl);

      this.isTransformApplied = true;
    }
  },
  render: {
    value: function render() {
      if (!this.isTransformApplied) this.apply();

      multiplyWithCurrentMatrix(this.transf);
    }
  },
  applyInverse: {
    value: function applyInverse() {
      this.apply();
      mat4.inverse(this.transf, this.transf);
    }
  },
  renderInverse: {
    value: function renderInverse() {
      if (!this.isTransformApplied) {
        this.apply();
        mat4.inverse(this.transf, this.transf);
      }
      multiplyWithCurrentMatrix(this.transf);
    }
  }
});
