var gen = require('random-seed');
var Level = require('./level.js');

class Dungeon{
  constructor(){
    //this.p = p;
    this.r = new gen('hello world');
    console.log('dungeon constructed');
  }

  setup(){
    console.log('setup');
    this.p.createCanvas(800, 500).class('p5').parent(document.getElementById('app'));
    var scale = 25;
    this.level = new Level('seed3', 800/scale, 500/scale, scale);
    console.log(this.level.getCoordinate(52));
    console.log(this.level.getCoordinate(53));
    console.log(this.level.getIndex(2, 2));
    console.log(this.level.getIndex(3, 2));
  }

  draw(){
    //console.log('draw');
    //var p = this.p;
    //p.background(51);
    //p.fill(255);
    //console.log(Math.round(p.frameRate()));
    //this.p.rect(this.r(100),this.r(100),50,50);
    //this.level.draw(this.p);
    //console.log('drawn');
  }
}

module.exports = Dungeon