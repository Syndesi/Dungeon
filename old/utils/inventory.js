var PIXI = require('pixi.js');

var Atlas = require('../utils/atlas.js');

class Inventory extends PIXI.Container{

  constructor(){
    super();
    this.d = window.store.data.player.inventory;
    var l = window.lib;
    this.toolbar = new PIXI.Container();
    this.inventory = new PIXI.Container();
    this.addChild(this.toolbar);
    this.addChild(this.inventory);
    var bg = new PIXI.Sprite(l.getTexture('gui', 'inventorySmall'));
    this.setPos(bg, 0, 0, 164 * l.scale, 20 * l.scale);
    this.toolbar.addChild(bg);
    this.cellOverlay = new PIXI.Sprite(l.getTexture('gui', 'cellOverlay'+this.d.activeColor));
    this.setPos(this.cellOverlay, 0, 1 * l.scale, 18 * l.scale, 18 * l.scale);
    this.toolbar.addChild(this.cellOverlay);
    this.updateOverlay();
    this.old = false;
    this.updatePos();
    this.old = this.d;
  }

  updatePos(){
    var width = window.store.game.screen.width;
    var height = window.store.game.screen.height;
    this.toolbar.x = (width - this.toolbar.width) / 2;
    this.toolbar.y = height - this.toolbar.height;
  }

  update(delta){
    this.updateOverlay();
  }


  updateOverlay(){
    this.cellOverlay.x = (1 + this.d.active * 18) * window.lib.scale;
    if(this.oldActiveColor !== this.d.activeColor){
      this.oldActiveColor = this.d.activeColor;
      this.cellOverlay.texture = window.lib.getTexture('gui', 'cellOverlay'+this.d.activeColor);
    }
  }

  setPos(obj, x, y, width, height){
    obj.x = x;
    obj.y = y;
    obj.width = width;
    obj.height = height;
  }

}

module.exports = Inventory