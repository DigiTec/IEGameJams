function GameState() {
}

GameState.prototype = Object.create(null);
GameState.prototype.constructor = GameState;

Object.defineProperties(GameState.prototype, {
    name: {
        get: function get_name() {
            throw new Error("Must override pure virtual getter for 'name'");
        }
    }
});

function GameStateManager() {
    //Dictionary of the states
    this.states = [];
    this.initialize();
}

GameStateManager.prototype = Object.create(null);
GameStateManager.prototype.constructor = GameStateManager;

(function () {
    // Hidden SubStates values.
    function SubStates() {
    }

    Object.defineProperties(SubStates, {
        ON_ENTER: {
            value: 0
        },
        ON_UPDATE: {
            value: 1
        },
        ON_EXIT: {
            value: 2
        }
    });

    Object.defineProperties(GameStateManager.prototype, {
        // Initialization of an instance
        initialize: {
            value: function initialize() {
                //The current state name
                this.currentState = null;

                // The current substate
                this.subState = SubStates.ON_ENTER;

                //Whether or not the state is currently changing.
                this.changingState = false;

                //The state waiting for safe activation.
                this.waitingState = null;
            }
        },

        // State Collection modifiers
        addState: {
            value: function addState(gameState) {
                this.states[gameState.name] = gameState;
            }
        },
        removeState: {
            value: function removeState(stateName) {
                this.states[stateName] = null;
            }
        },

        // State Manipulation
        setState: {
            value: function setState(stateName) {
                // Check if state exists
                if (!(stateName in this.states)) {
                    return false;
                }

                //Set Initial State
                if (this.currentState == null) {
                    this.currentState = this.states[stateName];
                    this.subState = SubStates.ON_ENTER;
                }
                else {
                    this.waitingState = this.states[stateName];
                    this.subState = SubStates.ON_EXIT;
                }
            }
        },
        // Game Loop
        update: {
            value: function update(gameTime) {
                if (this.currentState !== null) {
                    // Safe To Transition
                    if (this.changingState === true) {
                        this.currentState = this.waitingState;
                        this.changingState = false;
                        this.subState = SubStates.ON_ENTER;
                        this.waitingState = null;
                    }

                    if (this.subState === SubStates.ON_ENTER) {
                        if (this.currentState.onEnter) {
                            this.currentState.onEnter(gameTime);
                        }
                        this.subState = SubStates.ON_UPDATE;
                    }
                    else if (this.subState === SubStates.ON_UPDATE) {
                        if (this.currentState.onUpdate) {
                            this.currentState.onUpdate(gameTime);
                        }
                    }
                    else if (this.subState === SubStates.ON_EXIT) {
                        this.changingState = true;
                        if (this.currentState.onExit) {
                            this.currentState.onExit(gameTime);
                        }
                    }
                }
            }
        },
        draw: {
            value: function draw(gameTime) {
                if (this.currentState !== null && this.subState === SubStates.ON_UPDATE) {
                    if (this.currentState.onDraw) {
                        this.currentState.onDraw(gameTime);
                    }
                }
            }
        }
    });
})();
