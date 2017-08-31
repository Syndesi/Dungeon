var PIXI = require('pixi.js');

class AlleyMonster extends PIXI.Container{

  constructor(){
    super();
    this.d = {
      'scale': 3,
      'size': 16,
      'animation': {}
    };
    var l = window.lib;
    this.monster = new PIXI.Sprite(l.getTexture('tilemap', 'alleymonster-0'));
    this.monster.width = l.scale * this.d.size;
    this.monster.height = l.scale * this.d.size;
    this.addChild(this.monster);
  }

  update(delta){
    if(Math.random() < 0.05){
      this.monster.texture = window.lib.getTexture('tilemap', 'alleymonster-2');
    } else {
      this.monster.texture = window.lib.getTexture('tilemap', 'alleymonster-0');
    }
  }

}

module.exports = AlleyMonster