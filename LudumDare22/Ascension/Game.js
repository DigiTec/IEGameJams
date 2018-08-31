function Game() {
  //Timing timer
  this.timeCurrent = getTimeInMilliseconds();
  this.timeElapsed = 0;
  this.timePrevious;

  initWebGLAM("canvas");

  this.GameStateMgr = new GameStateManager();
  this.GameStateMgr.addState(new InGame(this));
  this.GameStateMgr.addState(new MainMenu(this));
  this.GameStateMgr.addState(new PauseMenu(this));

  // Initial state. Should be me 'MENU'
  // this.GameStateMgr.setState('MainMenu');
  this.GameStateMgr.setState("InGame");

  // Kick off the game!
  this.timePrevious = this.timeCurrent;
}

Game.prototype = Object.create(null);
Game.prototype.constructor = Game;

Object.defineProperties(Game.prototype, {
  update: {
    value: function update(tick) {
      this.timeCurrent = getTimeInMilliseconds();
      this.timeElapsed = this.timeCurrent - this.timePrevious;

      this.GameStateMgr.update(tick);
      this.GameStateMgr.draw(tick);

      this.timeGame += tick;
      this.timePrevious = this.timeCurrent;
    }
  }
});
