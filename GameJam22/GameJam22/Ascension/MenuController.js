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

    //Menu Collection modifiers
    //Add Menu
    this.addMenu = (function (name, menu) {
        menu.defaultColor = this.defaultColor;
        menu.selectedColor = this.selectedColor;
        menu.parent = this;
        this.menus[name] = menu;
        if (this.currentMenu == null) {
            this.currentMenu = name;
        }
    });

    //Get current Menu
    this.getCurrentMenu = (function () {
        this.menus[this.currentMenu];
    });

    //Set current Menu
    this.setCurrentMenu = (function (name) {
        this.currentMenu = name;
    });

    this.update = (function (gameTime) {
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
    });

    this.draw = (function (gameTime, context) {
        this.menus[this.currentMenu].draw(gameTime, context);
    });

    this.onKeyDown = (function (evt) {
        console.log("onKeyDown");
        this.setKeyState(evt.key || evt.keyIdentifier, true);
    });

    this.onKeyUp = (function (evt) {
        console.log("onKeyUp");
        this.setKeyState(evt.key || evt.keyIdentifier, false);
    });

    //Set KeyState and Pressed State: Does not use key held so much as is set when the key is pressed and released
    this.setKeyState = (function (keyBind, newValue) {
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
    });

    window.addEventListener("keyup", this.onKeyUp.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));

    this.clean = (function () {
        window.removeEventListener("keyup", this.onKeyUp.bind(this));
        window.removeEventListener("keydown", this.onKeyDown.bind(this));
    });
}


MenuController.prototype = Object.create(null);
MenuController.prototype.constructor = MenuController;