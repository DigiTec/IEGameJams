// WebGlam
// WebGL Assistance Manager

if (typeof cntScriptLoads === 'undefined')
    var cntScriptLoads = 0;

// Helper Include Script Function
function IncludeScript(filepath) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // TODO: finish
    script.onload = function () {
        cntScriptLoads--;
    }

    // if defined webglam relative path then use it as prefix
    if(typeof WEBGLAM_RELATIVE_PATH === 'undefined')
        script.src = 'WebGLAM/' + filepath;
    else
        script.src = WEBGLAM_RELATIVE_PATH  + '/' + filepath;
    
    //script.onreadystatechange = callback;
    //script.onload = callback;
    
    ++cntScriptLoads;
    head.appendChild(script);
}

// http://code.google.com/p/glmatrix/wiki/Usage

IncludeScript('glMatrix-0.9.5.min.js');
IncludeScript('Timer.js');
IncludeScript('Math.js');
IncludeScript('Transform.js');
IncludeScript('Mesh.js');
IncludeScript('Texture.js');
IncludeScript('Camera.js');
IncludeScript('ShaderCollection.js');
IncludeScript('Shader.js');
IncludeScript('WebGLContext.js');
IncludeScript('Utils.js');

function initWebGLAM(idCanvas) {
    mvMatrix = mat4.create();
    mvMatrixStack = [];
    pMatrix = mat4.create();
    camMatrix = mat4.create();

    initGL(idCanvas);
    CreateAllVertexAndFragmentShaders();

    WEBGLAM = {
        version: '.01',
        viewport: {
            width: gl.viewportWidth,
            height: gl.viewportHeight
        }
    }; // Object to be used by components and global access.

    console.log('>> WebGLAM ' + WEBGLAM.version + ' Initialized <<');
}