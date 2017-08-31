var PIXI = require('pixi.js');
var Atlas = require('../utils/atlas.js');

class Tile extends PIXI.Container {

  constructor(atlas, textureId, drag, friction){
    super();
    this.atlas = new Atlas();
    this.data = {
      'drag': drag,         // friction in the tile, e.g. swimming in water
      'friction': friction, // friction on the tile, e.g. walking on a road
    };
    this.tile = new PIXI.Sprite(this.atlas.getTexture(atlas, textureId));
    this.tile.scale.set(3);
    this.addChild(this.tile);
  }

  /**
   * called from entitys are touching the tile
   */
  touchTile(entity){
    //entity.effect.add('fire', 3);
  }

  /**
   * called when entitys are inside the tile
   */
  inTile(entity){
    //entity.effect.add('drowning', 1);
  }


}

module.exports = Tile