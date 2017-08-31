var PIXI = require('pixi.js');
var Atlas = require('../../utils/atlas.js');
var Item = require('../../primitives/item.js');

class JungleRapier extends Item {

  constructor(){
    super('jungleRapier', {});
    this.item._texture = this.atlas.getTexture('texture', 'tile-5-5');
    this.setText("<a>Jungle Rapier</a>");
  }

}

module.exports = JungleRapier