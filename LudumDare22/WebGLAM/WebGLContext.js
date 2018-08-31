// WebGL Context
var gl;

function initGL(idCanvas) {
  try {
    var canvas = document.getElementById(idCanvas);
    gl = canvas.getContext("experimental-webgl", { premultipliedAlpha: false });

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  } catch (e) {}
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}
