var gen = require('random-seed');
var PIXI = require('pixi.js');

var Atlas = require('./atlas.js');
var Torch = require('../primitives/torch.js');
var AlleyMonster = require('../primitives/alleyMonster.js');


class Room extends PIXI.Container{

  constructor(top, right, bottom, left, seed, theme = 'brick', size = 16, scale = 3){
    // true = no door/entry
    super();
    this.wall     = {
      'top':      top,
      'right':    right,
      'bottom':   bottom,
      'left':     left
    };
    this.r        = new gen(seed);
    this.atlas    = new Atlas();
    this.tiles    = [];
    this.d        = {
      'size':     size,
      'scale':    scale
    };
    this.theme    = theme;
    this.animated = [];
    this.bg       = new PIXI.Container();
    this.deco     = new PIXI.Container();
    this.fg       = new PIXI.Container();
    this.addChild(this.bg);
    this.addChild(this.deco);
    this.addChild(this.fg);

    this.generate();
    this.bg.cacheAsBitmap = true;
    this.fg.cacheAsBitmap = true;
  }


  generate(){
    var r = 0;
    var fg = [];
    var bg = [];
    var deco = [];
    for(var y = 0;y < 6;y++){
      for(var x = 0;x < 6;x++){
        r = this.r.random();
        if(r < 0.8){         // 80%
          bg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-bg-0');
        } else if(r < 0.895){ // 9.5%
          bg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-bg-1');
        } else if(r < 0.99){  // 9.5%
          bg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-bg-1');
        } else {              // 1%
          bg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-bg-3');
        }
        if(y == 0 || y == 5){
          // top or bottom wall
          if(r < 0.8){        // 80%
            fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-0');
          } else if(r < 0.9){ // 10%
            fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-1');
          } else {            // 10%
            fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-2');
          }
        } else {
          if(x == 0){
            // left wall
            if(r < 0.8){        // 80%
              fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-right-0');
            } else if(r < 0.9){ // 10%
              fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-right-1');
            } else {            // 10%
              fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-right-2');
            }
          } else if(x == 5){
            // right wall
            if(r < 0.8){        // 80%
              fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-left-0');
            } else if(r < 0.9){ // 10%
              fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-left-1');
            } else {            // 10%
              fg[this.getIndex(x, y)] = this.getSprite('tilemap', 'cobble-fg-left-2');
            }
          }
          // special background, e.g. tables etc.
          if(y == 4 && (x !== 1 || x !== 4)){
            // floor
            if(r < 0.4){
              // floor decoration
              r = this.r.random();
              switch(Math.floor(r * 8)){
                case 0:
                  deco[this.getIndex(x, y)] = this.getSprite('tilemap', 'skull-0');
                  break;
                case 1:
                  deco[this.getIndex(x, y)] = this.getSprite('tilemap', 'skull-1');
                  break;
                case 2:
                  deco[this.getIndex(x, y)] = this.getSprite('tilemap', 'mushroom-0');
                  break;
                case 3:
                  deco[this.getIndex(x, y)] = this.getSprite('tilemap', 'mushroom-1');
                  break;
                case 4:
                  deco[this.getIndex(x, y)] = this.getSprite('tilemap', 'sword-floor-0');
                  break;
                case 5:
                  deco[this.getIndex(x, y)] = this.getSprite('tilemap', 'sword-floor-1');
                  break;
                case 6:
                  deco[this.getIndex(x, y)] = this.getSprite('tilemap', 'table');
                  r = this.r.random();
                  if(r < 0.25){        // 25%
                    deco[this.getIndex(x, y - 1)] = this.getSprite('tilemap', 'books-0');
                  } else if(r < 0.5){  // 25%
                    deco[this.getIndex(x, y - 1)] = this.getSprite('tilemap', 'books-1');
                  } else if(r < 0.75){ // 25%
                    deco[this.getIndex(x, y - 1)] = this.getSprite('tilemap', 'books-2');
                  } else {             // 25%
                    deco[this.getIndex(x, y - 1)] = this.getSprite('tilemap', 'skull-0');
                  }
                  break;
                default:
                  break;
              }
            }
            r = this.r.random();
            if(r < 0.05){
              //var alleyMonster = new AlleyMonster();
              //alleyMonster.x = x * this.d.scale * this.d.size;
              //alleyMonster.y = y * this.d.scale * this.d.size;
              //this.animated.push(alleyMonster);
              //this.deco.addChild(alleyMonster);
            }
          }
        }
      }
    }
    // replace deco where the left torch will stand
    deco[this.getIndex(1, 2)] = null;
    deco[this.getIndex(1, 3)] = null;
    deco[this.getIndex(1, 4)] = null;
    // replace deco where the right torch will stand
    deco[this.getIndex(4, 2)] = null;
    deco[this.getIndex(4, 3)] = null;
    deco[this.getIndex(4, 4)] = null;
    // tapestry
    r = this.r.random();
    if(r < 0.25 && this.wall.top){
      r = this.r.random();
      var color = false;
      if(r < 0.17){        // 1/6
        color = 'gray';
      } else if(r < 0.33){ // 1/6
        color = 'blue';
      } else if(r < 0.5){  // 1/6
        color = 'red';
      } else if(r < 0.67){ // 1/6
        color = 'yellow';
      } else if(r < 0.83){ // 1/6
        color = 'green';
      } else {             // 1/6
        color = 'lightgray';
      }
      deco[this.getIndex(2, 1)] = this.getSprite('tilemap', 'tapestry-'+color+'-0');
      deco[this.getIndex(2, 2)] = this.getSprite('tilemap', 'tapestry-'+color+'-1');
      deco[this.getIndex(3, 2)] = this.getSprite('tilemap', 'tapestry-'+color+'-2');
      deco[this.getIndex(3, 1)] = this.getSprite('tilemap', 'tapestry-'+color+'-3');
    }
    if(!this.wall.top){
      // make a door to the top
      fg[this.getIndex(2, 0)] = null;
      fg[this.getIndex(3, 0)] = null;
      fg[this.getIndex(1, 0)] = this.getSprite('tilemap', 'cobble-fg-right-0');
      fg[this.getIndex(2, 2)] = this.getSprite('tilemap', 'stoneplank-0');
      fg[this.getIndex(3, 2)] = this.getSprite('tilemap', 'stoneplank-1');
      fg[this.getIndex(4, 0)] = this.getSprite('tilemap', 'cobble-fg-left-0');
    }
    if(!this.wall.right){
      // make a door to the right
      fg[this.getIndex(5, 1)] = null;
      fg[this.getIndex(5, 2)] = null;
      fg[this.getIndex(5, 3)] = null;
      fg[this.getIndex(5, 4)] = null;
    } else {
      deco[this.getIndex(5, 1)] = null;
      deco[this.getIndex(5, 2)] = null;
      deco[this.getIndex(5, 3)] = null;
      deco[this.getIndex(5, 4)] = null;
    }
    if(!this.wall.bottom){
      // make a door to the bottom
      fg[this.getIndex(1, 5)] = this.getSprite('tilemap', 'cobble-fg-right-0');
      fg[this.getIndex(2, 5)] = this.getSprite('tilemap', 'stoneplank-0');
      fg[this.getIndex(3, 5)] = this.getSprite('tilemap', 'stoneplank-1');
      fg[this.getIndex(4, 5)] = this.getSprite('tilemap', 'cobble-fg-left-0');
    }
    if(!this.wall.left){
      // make a door to the left
      fg[this.getIndex(0, 1)] = null;
      fg[this.getIndex(0, 2)] = null;
      fg[this.getIndex(0, 3)] = null;
      fg[this.getIndex(0, 4)] = null;
    } else {
      deco[this.getIndex(0, 1)] = null;
      deco[this.getIndex(0, 2)] = null;
      deco[this.getIndex(0, 3)] = null;
      deco[this.getIndex(0, 4)] = null;
    }
    for(var y = 0;y < 6;y++){
      for(var x = 0;x < 6;x++){
        this.addBlock(this.bg, bg[this.getIndex(x, y)], x, y);
        this.addBlock(this.fg, fg[this.getIndex(x, y)], x, y);
        this.addBlock(this.deco, deco[this.getIndex(x, y)], x, y);
      }
    }
    var torch1 = new Torch(this.r.random());
    torch1.x = 1 * this.d.scale * this.d.size;
    torch1.y = 4 * this.d.scale * this.d.size;
    this.animated.push(torch1);
    this.deco.addChild(torch1);
    var torch2 = new Torch(this.r.random());
    torch2.x = 4 * this.d.scale * this.d.size;
    torch2.y = 4 * this.d.scale * this.d.size;
    this.animated.push(torch2);
    this.deco.addChild(torch2);
  }

  update(delta){
    for(var i in this.animated){
      this.animated[i].update(delta);
    }
  }

  addBlock(container, block, x, y){
    var length = this.d.scale * this.d.size;
    if(block){
      block.x = x * length;
      block.y = y * length;
      block.width = length;
      block.height = length;
      container.addChild(block);
    }
  }

  getSprite(atlas, id){
    return new PIXI.Sprite(this.atlas.getTexture(atlas, id));
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
    if(x < 0 || y < 0 || x >= 6 || y >= 6){
      return false;
    }
    return x + y*6;
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
    return {x: index % 6, y: Math.floor(index / 6)};
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
    if(index < 0 || index >= 36){
      return false;
    }
    return true;
  }

}

module.exports = Room