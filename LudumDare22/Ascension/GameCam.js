function GameCam(game) {
    this.game = game;

    this.animInterp = .05;
    this.y = 0;

    this.camera = new Camera(3000);
    this.camera.transform.translate(0, 0, -this.camera.getZToMatchPixelsDimension());
}


// Instance methods
Object.defineProperties(GameCam.prototype, {
    isInView: {
        value: function isInView(y, scl) {
            if (typeof scl === 'undefined') {
                scl = 0;
            }
            return ((y > -this.camera.getViewTopHeight() + this.y - scl) &&
                (y < this.camera.getViewTopHeight() + this.y + scl))
        }
    },
    isUnderView: {
        value: function isUnderView(y, scl) {
            if (typeof scl === 'undefined') {
                scl = 0;
            }
            return (y < -this.camera.getViewTopHeight() + this.y - scl);
        }
    },
    update: {
        value: function update() {
            this.y += Math.max(0, (this.game.player.y - this.y - 300));
            this.camera.transform.translate(0, this.y, this.camera.transform.pos[2]);
        }
    },
    draw: {
        value: function draw() {
            this.camera.draw();
        }
    }
});
