function InGame(game) {

    this.viewXMin = null;
    this.viewXMax = null;
    this.levelHeight = 20000;
    this.scl = 50;

    this.game = game;

    // Game content types.
    this.player = null;
    this.level = null;
    this.gamecam = null;
}

InGame.prototype = Object.create(GameState.prototype);
InGame.prototype.constructor = InGame;

Object.defineProperties(InGame.prototype, {
    name: {
        get: function get_name() {
            return "InGame";
        }
    },
    onEnter: {
        value: function onEnter() {
            initWebGLAM('canvas');

            this.viewXMin = -WEBGLAM.viewport.width;
            this.viewXMax = -this.viewXMin;

            this.gamecam = new GameCam(this);

            this.level = new LevelManager(this);
            this.level.generatePlatforms(0, this.levelHeight);

            this.player = new Player(this, this.level.platforms[0].x, this.level.platforms[0].y);
        }
    },
    onUpdate: {
        value: function onUpdate() {
            this.gamecam.update();
            this.level.update();
            this.player.update();

            var collisionInfo = this.level.checkForPlayerCollision(this.player);

            // CONTINUE means no collision
            if (collisionInfo.action !== PlatformAction.CONTINUE) {
                this.player.applyPlatform(collisionInfo.y, collisionInfo.action);
            }
        }
    },
    onDraw: {
        value: function onDraw() {
            this.gamecam.draw();
            this.level.draw();
            this.player.draw();
        }
    },
    onExit: {
        value: function onExit() {


        }
    }
});