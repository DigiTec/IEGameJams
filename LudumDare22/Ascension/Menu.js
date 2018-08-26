function MenuItem(text) {
  this.text = text;
  this.targetMenu = null;
  this.params = null;
  this.onSelect = function () { };
}

MenuItem.prototype = Object.create(null);
MenuItem.prototype.constructor = MenuItem;

function Menu(x, y, width, height) {
  //Dictionary of the items
  this.items = new Array();

  //The current state name
  this.menuIndex = 0;

  //Menu controller Parent
  this.parent = null;

  //Item offset
  this.itemOffset = 0;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  //Colors
  this.defaultColor = "white";
  this.selectedColor = "yellow";
}

Menu.prototype = Object.create(null);
Menu.prototype.constructor = Menu;

Object.defineProperties(Menu.prototype, {
  addItem: {
    value: function addItem(menuItem) {
      this.items[this.items.length] = menuItem;
      this.itemOffset = this.height / this.items.length;
    }
  },
  selectItem: {
    value: function selectItem(index) {
      this.menuIndex = index;
      this.items[this.menuIndex].onSelect(this.items[this.menuIndex].params);
      var targetMenu = this.items[this.menuIndex].targetMenu;
      if (targetMenu !== null) {
        this.parent.setMenu(targetMenu);
      }
    }
  },
  nextItem: {
    value: function nextItem() {
      if (++this.menuIndex >= this.items.length) {
        this.menuIndex = 0;
      }
    }
  },
  previousItem: {
    value: function previousItem() {
      if (--this.menuIndex < 0) {
        this.menuIndex = this.items.length - 1;
      }
    }
  },
  draw: {
    value: function draw(gameTime, context) {
      for (var i = 0; i < this.items.length; ++i) {
        context.save();
        context.font = "30px Verdana";
        context.fillStyle = "white";
        context.shadowColor = "black";
        context.shadowOffsetX = 5;
        context.shadowOffsetY = 5;
        context.shadowBlur = 3;
        if (this.menuIndex == i) {
          context.fillStyle = "yellow";
        }
        context.fillText(this.items[i].text, this.x + ((this.width >> 1) - (context.measureText(this.items[i].text).width >> 1)),
          (this.y + (this.itemOffset * i)) + (this.height >> 1));
        context.restore();
      }
    }
  }
});