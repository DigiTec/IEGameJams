function PauseMenu(game) {
    this.game = game;

    // Game content types.
    this.player = null;
    this.gamecam = null;

    this.onEnter = function () {
        this.gamecam = new GameCam(this);
        this.player = new Player(this);
        
        this.canvas2D = document.getElementById("canvas2D");
        this.canvas2D.style.zIndex = 1;
        this.context = this.canvas2D.getContext("2d");
        document.getElementById("canvas").style.zindex = 0;
        
        this.menuController = new MenuController();
        var pauseMenu = new Menu(0, this.canvas2D.height >> 1, this.canvas2D.width, (this.canvas2D.height >> 1) - 25);


        var playOption = new MenuItem("Restart");
        playOption.params = this.game.GameStateMgr;
        playOption.onSelect = function (){
            this.params.setState("InGame");
        };

        var credits = new MenuItem("Credits");
        //credits.targetMenu = "Credits";

        pauseMenu.addItem(playOption);
        pauseMenu.addItem(credits);
        this.menuController.addMenu("Main", pauseMenu);
    }


    this.onUpdate = function (gameTime) {
        this.gamecam.update();

        // Manage fake collision detection here
        if (this.player.y <= 0) {
            this.player.applyPlatform(0, "normal");
        }

        //Allow input to go through for background movement.
        this.player.update();
        
        //Check input for menu
        this.menuController.update(gameTime);
    };


    this.onDraw = function (gameTime) {
        this.gamecam.draw();
        this.player.draw();

        //Clear 
        this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);

        this.menuController.draw(gameTime, this.context);
    };

    this.onExit = function () {
        this.menuController.clean();
        this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        this.canvas2D.style.zIndex = 0;
        document.getElementById("canvas").style.zindex = 1;
    }
}

PauseMenu.prototype = new GameState("PauseMenu");
PauseMenu.prototype.constructor = PauseMenu;