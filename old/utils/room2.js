var gen = require('random-seed');
var PIXI = require('pixi.js');

var Atlas = require('./atlas.js');


class Room {

  constructor(width, height, tilesize, template, seed){
    this.width     = width;
    this.height    = height;
    this.template  = template;
    this.r         = new gen(seed);
    this.atlas     = new Atlas();
    this.tiles     = [];
    this.tilesize  = tilesize;
    this.container = new PIXI.Container();
    this.container.x = 0;
    this.container.y = 0;
  }

  addTiles(){
    var container = new PIXI.Container();
    container.x = 0;
    container.y = 0;
    var tile = null;
    for(var y = 0;y < this.height;y++){
      for(var x = 0;x < this.width;x++){
        if(Math.random() < 0.9){
          tile = new PIXI.Sprite(this.atlas.getTexture('texture', 5, 3));
        } else {
          switch(Math.floor(Math.random()*3)){
            case 0:
              tile = new PIXI.Sprite(this.atlas.getTexture('texture', 0, 1));
              break;
            case 1:
              tile = new PIXI.Sprite(this.atlas.getTexture('texture', 1, 0));
              break;
            case 2:
              tile = new PIXI.Sprite(this.atlas.getTexture('texture', 1, 1));
              break;
            default:
              tile = new PIXI.Sprite(this.atlas.getTexture('texture', 12, 4));
              break;
          }
        }
        tile.x      = x*this.tilesize;
        tile.y      = y*this.tilesize;
        tile.width  = this.tilesize;
        tile.height = this.tilesize;
        container.addChild(tile);
      }
    }
    this.container.addChild(container);
  }

  getContainer(){
    this.addTiles();
    return this.container;
  }

}

module.exports = Room