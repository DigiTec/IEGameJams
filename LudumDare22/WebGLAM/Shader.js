/**************************************Shaders.js***********************************/
var arrayVertexShaders = [];
var arrayFragmentShaders = [];
var arrayShaderProgram = [];

function getShader(gl, shaderScript) {
  if (!shaderScript) {
    return null;
  }

  var str = "";
  if (!(typeof shaderScript.textContent === "undefined")) {
    // Get string from Inline shader
    str = shaderScript.textContent;
  } else {
    // Get string from <script> tag
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str, str.length);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  // Check if shader is texture dependent
  shader.isTextureDependent = shaderScript.textContent.match(/texture2D/)
    ? true
    : false;

  return shader;
}

function CreateAllVertexAndFragmentShaders() {
  var scripts = document.getElementsByTagName("script");

  // Index all shaders in 'arrayShaderStrings' array
  for (var i = 0; i < arrayShaderStrings.length; ++i) {
    // Add Fragment Shaders
    if (arrayShaderStrings[i].type == "x-shader/x-fragment") {
      if (!(arrayShaderStrings[i].id in arrayFragmentShaders)) {
        arrayFragmentShaders[arrayShaderStrings[i].id] = getShader(
          gl,
          arrayShaderStrings[i]
        );
      }
    }
    // Add Vertex Shaders
    else if (arrayShaderStrings[i].type == "x-shader/x-vertex") {
      if (!(arrayShaderStrings[i].id in arrayVertexShaders)) {
        arrayVertexShaders[arrayShaderStrings[i].id] = getShader(
          gl,
          arrayShaderStrings[i]
        );
      }
    }
  }

  // Index all shaders in document.
  for (var i = 0; i < scripts.length; ++i) {
    // Add Fragment Shaders
    if (scripts[i].type == "x-shader/x-fragment") {
      if (!(scripts[i].id in arrayFragmentShaders)) {
        arrayFragmentShaders[scripts[i].id] = getShader(gl, scripts[i]);
      }
    }
    // Add Vertex Shaders
    else if (scripts[i].type == "x-shader/x-vertex") {
      if (!(scripts[i].id in arrayVertexShaders)) {
        arrayVertexShaders[scripts[i].id] = getShader(gl, scripts[i]);
      }
    }
  }
}

function buildShaderProgram(vertexShader, fragmentShader) {
  if (!(fragmentShader instanceof WebGLShader)) {
    throw "buildShaderProgram: fragmentShader args is not a WebGLShader";
  }
  if (!(vertexShader instanceof WebGLShader)) {
    throw "buildShaderProgram: vertexShader args is not a WebGLShader";
  }

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  // Check if shader program is texture dependent
  shaderProgram.isTextureDependent = fragmentShader.isTextureDependent;
  if (shaderProgram.isTextureDependent) {
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(
      this.shaderProgram,
      "aTextureCoord"
    );
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  }

  return shaderProgram;
}

function useShaderProgram(shaderProgram) {
  gl.useProgram(shaderProgram);

  // Get shader vertex entry points.
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // Get shader color entry points.
  shaderProgram.colorAttribute = gl.getUniformLocation(
    shaderProgram,
    "aFragColor"
  );
  gl.uniform4fv(shaderProgram.colorAttribute, WEBGLAM.mesh.vec4Color);

  // Get shader matrix arguments entry points
  shaderProgram.pMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uPMatrix"
  );
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uMVMatrix"
  );
  shaderProgram.camMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uCamMatrix"
  );

  // Send matrix arguments to shader.
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  gl.uniformMatrix4fv(shaderProgram.camMatrixUniform, false, camMatrix);

  // Point shader sampler at currently binded texture.
  if (this.shaderProgram.isTextureDependent) {
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  }
}
