//Constants
_PIDDIV2 = Math.PI * 0.5;
_PI = Math.PI;
_2PI = Math.PI * 2;
_DEG2RAD = _PI / 180;
_RAD2DEG = 180 / _PI;

//Trig

function DegToRad(degrees) {
  return degrees * _DEG2RAD;
}

// Matrices
function mvPushMatrix() {
  var matCopy = mat4.create();
  mat4.set(mvMatrix, matCopy);
  mvMatrixStack.push(matCopy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function multiplyWithCurrentMatrix(mat) {
  mat4.multiply(mat, mvMatrix, mvMatrix);
}

function mvIdentity() {
  mat4.identity(mvMatrix);
}
