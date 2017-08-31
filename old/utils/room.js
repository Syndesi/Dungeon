var gen = require('random-seed');
var PIXI = require('pixi.js');

class Room{

  constructor(stage, width, height, template, seed){
    this.stage = stage;
    this.width = width;
    this.height = height;
    this.template = template;
    this.tiles = [];
    this.entitys = [];
    this.r = new gen(seed);
    this.generate();
  }

  generate(){
    console.log('generating');
    for(var y = 0;y < this.height;y++){
      for(var x = 0;x < this.width;x++){

        this.tiles[this.getIndex(x, y)] = false;
      }
    }
  }

  draw(){
    console.log('drawed');
  }

  getIndex(x, y){
    if(x < 0 || y < 0 || x >= this.width || y >= this.height){
      return false;
    }
    return x + y*this.width;
  }

}

module.exports = Room