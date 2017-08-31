var PIXI = require('pixi.js');
var Atlas = require('../utils/atlas.js');
var v = require('victor');

class Entity extends PIXI.Container {

  constructor(id, config){
    super();
    this.atlas = new Atlas();
    this.data = {
      'id':   id,
      'acc':  new v(0, 9.81), // acceleration
      'vel':  new v(0, 0), // velocity
      'drag': 0.1          // drag 
    };
    this.tile = new PIXI.Sprite(this.atlas.getTexture('texture', 'tile-4-6'));
    this.tile.scale.set(3);
    this.addChild(this.tile);
  }

  update(delta){
    this.updatePosition(delta);
  }

  updatePosition(delta){
    var d = this.data;
    //var drag = d.acc.invert().multiply(new v(d.drag, d.drag));
    //d.acc.add(drag);

    this.position.x += d.vel.x * delta  +  0.5 * d.acc.x * Math.pow(delta, 2);
    this.position.y += d.vel.y * delta  +  0.5 * d.acc.y * Math.pow(delta, 2);
  }

  checkCollisions(objects){
    var colliding = [];

  }

  isColliding(obj1, obj2){
    if(obj1.x){}
  }

  /**
   * called from entitys are touching the tile
   */
  touchTile(entity){
    entity.effect.add('fire', 3);
  }

  /**
   * called when entitys are inside the tile
   */
  inTile(entity){
    entity.effect.add('drowning', 1);
  }


}

module.exports = Entity