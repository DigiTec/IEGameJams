function MenuController() {  
    //Menu collection
    this.menus = new Array();
    this.currentMenu = null;

    //Defaults
    this.defaultColor = "white";
    this.selectedColor = "yellow";
    
    //Input flags
    this.keyUp = false;
    this.keyUpPressed = false;
    this.keyDown = false;
    this.keyDownPressed = false;
    this.keyEnter = false;
    this.keyEnterPressed = false;

    (function _privateInit() {
        var _keyUp = this.onKeyUp.bind(this);
        var _keyDown = this.onKeyDown.bind(this);

        window.addEventListener("keyup", _keyUp);
        window.addEventListener("keydown", _keyDown);

        this.clean = function clean() {
            window.removeEventListener("keyup", _keyUp);
            window.removeEventListener("keydown", _keyDown);
        };
    })();
}


MenuController.prototype = Object.create(null);
MenuController.prototype.constructor = MenuController;

Object.defineProperties(MenuController.prototype, {
    //Set KeyState and Pressed State: Does not use key held so much as is set when the key is pressed and released
    setKeyState: {
        value: function setKeyState(keyBind, newValue) {
            switch (keyBind) {
                case "Up":
                    this.keyUpPressed = (this.keyUp == true && !newValue);
                    this.keyUp = newValue;
                    break;
                case "Down":
                    this.keyDownPressed = (this.keyDown == true && !newValue);
                    this.keyDown = newValue;
                    break;
                case "Enter":
                    this.keyEnterPressed = (this.keyEnter == true && !newValue);
                    this.keyEnter = newValue;
                    break;
            }
        }
    },
    addMenu: {
        value: function addMenu(name, menu) {
            menu.defaultColor = this.defaultColor;
            menu.selectedColor = this.selectedColor;
            menu.parent = this;
            this.menus[name] = menu;
            if (this.currentMenu == null) {
                this.currentMenu = name;
            }
        }
    },
    getCurrentMenu: {
        value: function getCurrentMenu() {
            this.menus[this.currentMenu];
        }
    },
    setCurrentMenu: {
        value: function setCurrentMenu(name) {
            this.currentMenu = name;
        }
    },
    update: {
        value: function update(gameTime) {
            var activeMenu = this.menus[this.currentMenu];
            if (this.keyEnterPressed) {
                this.keyEnterPressed = false;
                activeMenu.selectItem(activeMenu.menuIndex);
            }
            if (this.keyUpPressed) {
                this.keyUpPressed = false;
                activeMenu.previousItem();
            }
            else if (this.keyDownPressed) {
                this.keyDownPressed = false;
                activeMenu.nextItem();
            }
        }
    },
    draw: {
        value: function draw(gameTime, context) {
            this.menus[this.currentMenu].draw(gameTime, context);
        }
    },

    onKeyUp: {
        value: function onKeyUp(evt) {
            console.log("onKeyUp");
            this.setKeyState(evt.key || evt.keyIdentifier, false);
        }
    },
    onKeyDown: {
        value: function onKeyDown(evt) {
            console.log("onKeyDown");
            this.setKeyState(evt.key || evt.keyIdentifier, true);
        }
    },
});