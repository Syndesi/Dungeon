var PIXI = require('pixi.js');
var Atlas = require('../utils/atlas.js');

class Effect extends PIXI.Container {

  constructor(id, config){
    super();
    this.atlas = new Atlas();
    /*
      - particle effects
      - onUpdate() method
      - internall timer which removes itself after x seconds
     */
    this.item = new PIXI.Sprite(this.atlas.getTexture('texture', 'tile-4-6'));
    this.item.scale.set(3);
    //console.log(new PIXI.Sprite(this.atlas.getTexture('texture', 'tile-4-6')));
    this.addChild(this.item);
    this.text = new Text('64', 48, 48, 8);
    this.text.x = 48 - this.text.width;
    this.text.y = 48 - this.text.height;
    this.addChild(this.text);
    this.tooltip = new Tooltip(this.data.tooltip.text, this.data.tooltip.background);
    this.addChild(this.tooltip);
  }

  /**
   * called from entitys when stepping on the tile
   */
  onStep(entity){
    entity.effect.add('fire', 3);
  }


}

module.exports = Effect