// WebGlam
// WebGL Assistance Manager

if (typeof cntScriptLoads !== 'undefined') {
    var cntScriptLoads = 0;
}

// Helper Include Script Function
function IncludeScript(filepath, isDone) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';

    function _decrementScriptLoads() {
        cntScriptLoads--;
        console.log(cntScriptLoads);
    }
    script.onload = _decrementScriptLoads;

    // if defined webglam relative path then use it as prefix
    if (typeof ASCENSION_RELATIVE_PATH === 'undefined' || ASCENSION_RELATIVE_PATH === '') {
        script.src = '/Ascension/' + filepath;
    }
    else {
        script.src = ASCENSION_RELATIVE_PATH + '/' + filepath;
    }

    ++cntScriptLoads;
    head.appendChild(script);
}
/*
IncludeScript('GameCam.js');
IncludeScript('KeyboardController.js');
IncludeScript('Player.js');
IncludeScript('LevelManager.js');
IncludeScript('GameStateManager.js');
IncludeScript('Game.js');
IncludeScript('InGame.js');
IncludeScript('MainMenu.js');
IncludeScript('PauseMenu.js');
IncludeScript('MenuController.js');
IncludeScript('Menu.js');
*/