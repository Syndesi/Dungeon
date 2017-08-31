var gen = require('random-seed');
var PIXI = require('pixi.js');

var Quadtree = require('./quadtree.js');
var Atlas = require('./atlas.js');


class Cave extends PIXI.Container{

  constructor(width, height, tilesize, seed){
    super();
    this.d = {
      'width': width,
      'height': height
    };
    this.tilesize = tilesize;
    this.fill     = 0.50;
    this.r        = new gen(seed);
    this.atlas    = new Atlas();
    this.quadtree = new Quadtree(this.width * this.tilesize, this.height * this.tilesize);
    this.blocks   = false;

    this.generateCave();
    //this.smooth(1, 1);
    this.smooth(2, 2, 0.495);
    this.smooth(5, 5, 0.52);
    this.smooth(2, 1, 0.52);
    this.smooth(3, 3, 0.52);
    this.draw();
  }

  draw(){
    var sprite = false;
    for(var y = 0;y < this.d.height;y++){
      for(var x = 0;x < this.d.width;x++){
        if(this.blocks[this.getIndex(x, y)]){
          // wall
          sprite = new PIXI.Sprite(this.atlas.getTexture('texture', 'tile-9-0'));
        } else {
          // space
          sprite = new PIXI.Sprite(this.atlas.getTexture('texture', 'tile-11-2'));
        }
        sprite.x = x * this.tilesize;
        sprite.y = y * this.tilesize;
        sprite.width = this.tilesize;
        sprite.height = this.tilesize;
        this.addChild(sprite);
      }
    }
  }

  generateCave(){
    this.blocks = [];
    for(var y = 0;y < this.d.height;y++){
      for(var x = 0;x < this.d.width;x++){
        // true = wall, false = space
        this.blocks[this.getIndex(x, y)] = this.getRandomBool(this.fill);
      }
    }
  }

  smooth(rx, ry, fill){
    var newBlocks = [];
    for(var y = 0;y < this.d.height;y++){
      for(var x = 0;x < this.d.width;x++){
        var wall = 0;
        for(var dy = -ry;dy <= ry;dy++){
          for(var dx = -rx;dx <= rx;dx++){
            //console.log('x: '+x+', y: '+y+', dx: '+dx+', dy: '+dy+', state: '+this.getNeighbor(x, y, rx, ry));
            if(!(dx == 0 && ry == 0)){
              if(this.getNeighbor(x, y, dx, dy)){
                wall++;
              }
            }
          }
        }
        //console.log('walls: '+wall);
        //console.log(wall+'/'+Math.pow(2 * radius + 1, 2));
        //return false;
        if(wall / ((rx * 2 + 1) * (ry * 2 + 1)) > 1 - fill){
          newBlocks[this.getIndex(x, y)] = true;
        } else {
          newBlocks[this.getIndex(x, y)] = false;
        }
      }
    }
    this.blocks = newBlocks;
  }

  getNeighbor(x, y, dx, dy){
    if(this.getIndex(x, y) !== false && this.getIndex(x + dx, y + dy) !== false){
      return this.blocks[this.getIndex(x + dx, y + dy)];
    }
    return true; // space beyond the level should always be considered as "wall"
  }

  getRandomBool(fill){
    if(this.r.floatBetween(0, 1) < fill){
      return true;
    }
    return false;
  }

  /**
   * Returns the index of 2D-coordinates in a 1D-array.
   * @example
   * // Presupposes that the maze has a size of 10x10.
   * // returns 32
   * var level = new Level('seed', 10, 10);
   * console.log(level.getIndex(2, 3));
   * @param  {int} x the x-coordinate in the 2D-array
   * @param  {int} y the y-coordinate in the 2D-array
   * @return {int}   the resulting index in a 1D-array
   */
  getIndex(x, y){
    if(x < 0 || y < 0 || x >= this.d.width || y >= this.d.height){
      return false;
    }
    return x + y*this.d.width;
  }

  /**
   * Returns the 2D-coordinates from a 1D-index.
   * @example
   * // Presupposes that the maze has a size of 10x10
   * // returns {x: 2, y: 3}
   * var level = new Level('seed', 10, 10);
   * console.log(level.getCoordinate(32));
   * @param  {int}    index the 1D-index
   * @return {object}       an object containing a x- and a y-value or false, if the given index is not part of the current maze.
   */
  getCoordinate(index){
    if(!this.isInMaze(index)){
      return false;
    }
    return {x: index % this.d.width, y: Math.floor(index / this.d.width)};
  }

  /**
   * Checks if the given index is part of the maze.
   * @example
   * var level = new Level('seed', 10, 10);
   * // will return true:
   * console.log(level.isInMaze(99));
   * // will return false:
   * console.log(level.isInMaze(100));
   * @param  {int}  index the given index
   * @return {bool}       true: the cell is in the maze, false: the cell is not part of the maze
   */
  isInMaze(index){
    if(index < 0 || index >= this.d.width*this.d.height){
      return false;
    }
    return true;
  }

}

module.exports = Cave