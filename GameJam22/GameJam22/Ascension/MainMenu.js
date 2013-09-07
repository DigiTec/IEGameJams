function MainMenu(game) {
    this.game = game;

    // Game content types.
    this.player = null;
    this.gamecam = null;
}

MainMenu.prototype = Object.create(GameState.prototype);
MainMenu.prototype.constructor = MainMenu;

Object.defineProperties(MainMenu.prototype, {
    name: {
        get: function get_name() {
            return "MainMenu";
        }
    },
    onEnter: {
        value: function onEnter() {
            initWebGLAM('canvas');
            this.gamecam = new GameCam(this);
            this.player = new Player(this);

            this.canvas2D = document.getElementById("canvas2D");
            this.canvas2D.style.zIndex = 1;
            this.context = this.canvas2D.getContext("2d");

            this.canvasGL = document.getElementById("canvas");
            this.canvasGL.style.zindex = 0;

            this.menuController = new MenuController();
            var mainMenu = new Menu(0, this.canvas2D.height >> 1, this.canvas2D.width, (this.canvas2D.height >> 1) - 25);
            var playOption = new MenuItem("Play");
            playOption.params = this.game.GameStateMgr;
            playOption.onSelect = function () {
                this.params.setState("InGame");
            };

            var credits = new MenuItem("Credits");
            //credits.targetMenu = "Credits";

            mainMenu.addItem(playOption);
            mainMenu.addItem(credits);
            this.menuController.addMenu("Main", mainMenu);
        }
    },
    onExit: {
        value: function onExit() {
            this.menuController.clean();
            this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
            this.canvas2D.style.zIndex = 0;
            this.canvasGL.style.zindex = 1;
        }
    },
    onDraw: {
        value: function onDraw() {
            this.gamecam.draw();
            this.player.draw();

            this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
            this.menuController.draw(gameTime, this.context);
        }
    },
    onUpdate: {
        value: function onUpdate() {
            this.gamecam.update();

            // Manage fake collision detection here
            if (this.player.y <= 0) {
                this.player.applyPlatform(0, "normal");
            }

            //Allow input to go through for background movement.
            this.player.update();

            //Check input for menu
            this.menuController.update(gameTime);
        }
    },
});