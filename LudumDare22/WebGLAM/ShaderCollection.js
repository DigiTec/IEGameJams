arrayShaderStrings = [];

function WebGLAMAddShader(id, type, code) {
  if (!id || !type || !code)
    console.err("WebGLAMAddShader() :: Missing Arguments!");

  var shaderScript = { id: id, type: type, textContent: code };

  arrayShaderStrings.push(shaderScript);

  // If WEBGLAM is already defined, we missed the onStart shader load sweep, so load manually.
  if (!(typeof WEBGLAM === "undefined")) {
    var end = arrayShaderStrings.length - 1;

    // Add Fragment Shaders
    if (arrayShaderStrings[end].type == "x-shader/x-fragment") {
      if (!(arrayShaderStrings[i].id in arrayFragmentShaders))
        arrayFragmentShaders[arrayShaderStrings[end].id] = getShader(
          gl,
          arrayShaderStrings[end]
        );
    }
    // Add Vertex Shaders
    else if (arrayShaderStrings[end].type == "x-shader/x-vertex") {
      if (!(arrayShaderStrings[end].id in arrayVertexShaders))
        arrayVertexShaders[arrayShaderStrings[end].id] = getShader(
          gl,
          arrayShaderStrings[end]
        );
    }
  }
}

console.log("WEBGLAM::Loading Default Shaders...");

// Non - Textured Meshes.
WebGLAMAddShader(
  "shader-vs",
  "x-shader/x-vertex",
  [
    "attribute vec3 aVertexPosition;",

    "uniform mat4 uMVMatrix;",
    "uniform mat4 uPMatrix;",
    "uniform mat4 uCamMatrix;",

    "void main(void) {",
    "gl_Position = uPMatrix * uCamMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
    "}"
  ].join("\n")
);

WebGLAMAddShader(
  "shader-fs",
  "x-shader/x-fragment",
  [
    "precision mediump float;",
    "uniform vec4 aFragColor;",
    "void main(void) {",
    "gl_FragColor = aFragColor;",
    "}"
  ].join("\n")
);

// Textured Meshes.
WebGLAMAddShader(
  "shader-vs-texture",
  "x-shader/x-vertex",
  [
    "attribute vec3 aVertexPosition;",
    "attribute vec2 aTextureCoord;",

    "uniform mat4 uMVMatrix;",
    "uniform mat4 uPMatrix;",
    "uniform mat4 uCamMatrix;",

    "varying mediump vec2 vTextureCoord;",
    "void main(void) {",
    "gl_Position = uPMatrix * uCamMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
    "vTextureCoord = aTextureCoord;",
    "}"
  ].join("\n")
);

WebGLAMAddShader(
  "shader-fs-texture",
  "x-shader/x-fragment",
  [
    "precision mediump float;",
    "uniform vec4 aFragColor;",
    "varying mediump vec2 vTextureCoord;",
    "uniform sampler2D uSampler;",
    "void main(void) {",
    "gl_FragColor = texture2D(uSampler, vTextureCoord) * aFragColor;",
    "}"
  ].join("\n")
);

console.log("WEBGLAM::Shaders Loaded!");
