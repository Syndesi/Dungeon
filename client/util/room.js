import * as PIXI from 'pixi.js';
import randomSeed from 'random-seed';

import Grid from './grid.js';
import Torch from '../objects/torch.js';
//var AlleyMonster = require('../primitives/alleyMonster.js');

/**
 * This class will generate a single room based on a seed.
 */
class Room extends Grid{

  /**
   * @extends Grid
   * @param  {object}  store the game´s store
   * @param  {object}  walls an object containing the state of it´s 4 walls
   * @param  {string}  seed  the seed which should be used by this room
   * @param  {bool}    chest true: a chest will be generated in this room, false: no chest
   */
  constructor(store, walls, seed = 'seed', chest = false){
    super(6, 6);
    this.r = new randomSeed(seed);
    this.store = store;
    this.walls = walls;
    this.scale = this.store.scale;
    this.size  = 16;
    this.chest = chest;
    this.iterate((x, y) => {
      this.grid[this.getIndex(x, y)] = {
        'bg': null,
        'deco': null,
        'fg': null
      };
    });
    this.animated = [];
    this.room = new PIXI.Container();
    this.bg   = new PIXI.Container();
    this.deco = new PIXI.Container();
    this.fg   = new PIXI.Container();
    this.setCache(true);
    this.room.addChild(this.bg);
    this.room.addChild(this.deco);
    this.room.addChild(this.fg);
    this.generate();
  }

  /**
   * Used to update all animated elements in this room.
   * @param  {float} delta the time since the last update
   */
  update(delta){
    for(var i = 0;i < this.animated.length;i++){
      this.animated[i].update(delta);
    }
  }

  /**
   * Resolves all collisions between the given entity and all solid walls in this room.
   * @param  {object} entity the entity which should be resolved
   */
  resolveCollisions(entity){
    collisions = this.getCollisions(entity);
    var running = true;
    var lastCollisions = collisions.length;
    while(collisions.length > 0 && running){
      this.resolveCollisions(collisions[0], entity);
      collisions = this.getCollisions(entity);
      if(collisions.length >= lastCollisions || collisions.length <= 0){
        running = false;
      }
    }
  }

  /**
   * Returns all collisions between the given entity and all solid walls in this room.
   * @param  {object} entity the entity which is checked for collisions
   * @return {array}         an array containing all tiles which are colliding with the given entity
   */
  getCollisions(entity){
    var collisions = [];
    var wall = false;
    this.iterate((x, y) => {
      wall = this.grid[this.getIndex(x, y)].fg;
      if(wall){
        if(this.isColliding(entry, wall)){
          collisions.push(wall);
        }
      }
    });
    return collisions;
  }

  /**
   * Generates the room.
   */
  generate(){
    this.iterate((x, y) => {
      var index = this.getIndex(x, y);
      this.generateBackground(x, y);
      this.generateForeground(x, y);
      this.generateDeco(x, y);
    });
    this.generateTapestry();
    this.generateTorches();
    this.generateDoors();
    this.generateChest();
    this.draw();
  }

  /**
   * Used to draw the room.<br>
   * This function uses the {@link http://pixijs.download/dev/docs/PIXI.Container.html#cacheAsBitmap|*cacheAsBitmap*-optimization} given by Pixi.js.
   */
  draw(){
    this.setCache(false);
    this.iterate((x, y) => {
      var cell = this.grid[this.getIndex(x, y)];
      this.addBlock(this.bg, cell.bg, x, y);
      this.addBlock(this.deco, cell.deco, x, y);
      this.addBlock(this.fg, cell.fg, x, y);
    });
    this.setCache(true);
  }

  /**
   * This function will (de)activate the {@link http://pixijs.download/dev/docs/PIXI.Container.html#cacheAsBitmap|*cacheAsBitmap*-optimization} for the entire room.
   * @param {bool} status true: optimization activated, false: deactivated
   */
  setCache(status){
    this.bg.cacheAsBitmap = status;
    this.fg.cacheAsBitmap = status;
  }

  /**
   * A helper function which adds sprites to the rooms container.
   * @param {object} container the container where the sprite should be added
   * @param {object} block     the sprite which should be added
   * @param {int} x            the x-ccordinate in this room
   * @param {int} y            the y-coordinate in this room
   */
  addBlock(container, block, x, y){
    var length = this.scale * this.size;
    if(block){
      block.x = x * length;
      block.y = y * length;
      block.width = length;
      block.height = length;
      container.addChild(block);
    }
  }

  /**
   * Generates torches.
   */
  generateTorches(){
    // left torch
    var torchLeft = new Torch(this.store, this.r.random());
    torchLeft.x = 1 * 16 * this.store.scale;
    torchLeft.y = 4 * 16 * this.store.scale;
    this.deco.addChild(torchLeft);
    this.animated.push(torchLeft);
    this.grid[this.getIndex(1, 2)].deco = null;
    this.grid[this.getIndex(1, 3)].deco = null;
    this.grid[this.getIndex(1, 4)].deco = null;
    // right torch
    var torchRight = new Torch(this.store, this.r.random());
    torchRight.x = 4 * 16 * this.store.scale;
    torchRight.y = 4 * 16 * this.store.scale;
    this.deco.addChild(torchRight);
    this.animated.push(torchRight);
    this.grid[this.getIndex(4, 2)].deco = null;
    this.grid[this.getIndex(4, 3)].deco = null;
    this.grid[this.getIndex(4, 4)].deco = null;
  }

  /**
   * Generates a chest if activated.
   */
  generateChest(){
    if(this.chest){
      var x = 2 + Math.round(this.r.random());
      var y = 4;
      this.grid[this.getIndex(x, y)].deco = this.getSprite('tilemap', 'chest-1');
      this.grid[this.getIndex(x, y - 1)].deco = null;
    }
  }

  /**
   * Generates the background wall.
   * @param  {int} x the x-coordinate
   * @param  {int} y the y-coordinate
   */
  generateBackground(x, y){
    var r = this.r.random();
    var sprite = false;
    if(r < 0.8){         // 80%
      sprite = ['tilemap', 'cobble-bg-0'];
    } else if(r < 0.895){ // 9.5%
      sprite = ['tilemap', 'cobble-bg-1'];
    } else if(r < 0.99){  // 9.5%
      sprite = ['tilemap', 'cobble-bg-1'];
    } else {              // 1%
      sprite = ['tilemap', 'cobble-bg-3'];
    }
    if(sprite){
      this.grid[this.getIndex(x, y)].bg = this.getSprite(sprite[0], sprite[1]);
    }
  }

  /**
   * Generates the foreground, therefore the walls.
   * @param  {int} x the x-coordinate
   * @param  {int} y the y-coordinate
   */
  generateForeground(x, y){
    var r = this.r.random();
    var sprite = false;
    if(y == 0 || y == 5){
      // top or bottom wall
      if(r < 0.8){        // 80%
        sprite = ['tilemap', 'cobble-fg-0'];
      } else if(r < 0.9){ // 10%
        sprite = ['tilemap', 'cobble-fg-1'];
      } else {            // 10%
        sprite = ['tilemap', 'cobble-fg-2'];
      }
    } else {
      if(x == 0){
        // left wall
        if(r < 0.8){        // 80%
          sprite = ['tilemap', 'cobble-fg-right-0'];
        } else if(r < 0.9){ // 10%
          sprite = ['tilemap', 'cobble-fg-right-1'];
        } else {            // 10%
          sprite = ['tilemap', 'cobble-fg-right-2'];
        }
      } else if(x == 5){
        // right wall
        if(r < 0.8){        // 80%
          sprite = ['tilemap', 'cobble-fg-left-0'];
        } else if(r < 0.9){ // 10%
          sprite = ['tilemap', 'cobble-fg-left-1'];
        } else {            // 10%
          sprite = ['tilemap', 'cobble-fg-left-2'];
        }
      }
    }
    if(sprite){
      this.grid[this.getIndex(x, y)].fg = this.getSprite(sprite[0], sprite[1]);
    }
  }

  /**
   * Generates the doors to other rooms.
   */
  generateDoors(){
    if(!this.walls.top){
      // make a door to the top
      this.grid[this.getIndex(2, 0)].fg = null;
      this.grid[this.getIndex(3, 0)].fg = null;
      this.grid[this.getIndex(1, 0)].fg = this.getSprite('tilemap', 'cobble-fg-right-0');
      this.grid[this.getIndex(2, 2)].fg = this.getSprite('tilemap', 'stoneplank-0');
      this.grid[this.getIndex(3, 2)].fg = this.getSprite('tilemap', 'stoneplank-1');
      this.grid[this.getIndex(4, 0)].fg = this.getSprite('tilemap', 'cobble-fg-left-0');
      this.grid[this.getIndex(2, 2)].fg.jumpable = true;
      this.grid[this.getIndex(3, 2)].fg.jumpable = true;
    }
    if(!this.walls.right){
      // make a door to the right
      this.grid[this.getIndex(5, 1)].fg = null;
      this.grid[this.getIndex(5, 2)].fg = null;
      this.grid[this.getIndex(5, 3)].fg = null;
      this.grid[this.getIndex(5, 4)].fg = null;
    } else {
      this.grid[this.getIndex(5, 1)].deco = null;
      this.grid[this.getIndex(5, 2)].deco = null;
      this.grid[this.getIndex(5, 3)].deco = null;
      this.grid[this.getIndex(5, 4)].deco = null;
    }
    if(!this.walls.bottom){
      // make a door to the bottom
      this.grid[this.getIndex(1, 5)].fg = this.getSprite('tilemap', 'cobble-fg-right-0');
      this.grid[this.getIndex(2, 5)].fg = this.getSprite('tilemap', 'stoneplank-0');
      this.grid[this.getIndex(3, 5)].fg = this.getSprite('tilemap', 'stoneplank-1');
      this.grid[this.getIndex(4, 5)].fg = this.getSprite('tilemap', 'cobble-fg-left-0');
      this.grid[this.getIndex(2, 5)].fg.jumpable = true;
      this.grid[this.getIndex(3, 5)].fg.jumpable = true;
    }
    if(!this.walls.left){
      // make a door to the left
      this.grid[this.getIndex(0, 1)].fg = null;
      this.grid[this.getIndex(0, 2)].fg = null;
      this.grid[this.getIndex(0, 3)].fg = null;
      this.grid[this.getIndex(0, 4)].fg = null;
    } else {
      this.grid[this.getIndex(0, 1)].deco = null;
      this.grid[this.getIndex(0, 2)].deco = null;
      this.grid[this.getIndex(0, 3)].deco = null;
      this.grid[this.getIndex(0, 4)].deco = null;
    }
  }

  /**
   * Generates colorfull tapestrys.
   */
  generateTapestry(){
    var r = this.r.random();
    if(r < 0.5 && this.walls.top){
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
      this.grid[this.getIndex(2, 1)].deco = this.getSprite('tilemap', 'tapestry-'+color+'-0');
      this.grid[this.getIndex(2, 2)].deco = this.getSprite('tilemap', 'tapestry-'+color+'-1');
      this.grid[this.getIndex(3, 2)].deco = this.getSprite('tilemap', 'tapestry-'+color+'-2');
      this.grid[this.getIndex(3, 1)].deco = this.getSprite('tilemap', 'tapestry-'+color+'-3');
    }
  }

  /**
   * Generates decoration
   * @param  {int} x the x-coordinate
   * @param  {int} y the y-coordinate
   */
  generateDeco(x, y){
    var r = this.r.random();
    var sprite = false;
    if(r < 0.3){
      r = this.r.random();
      if(y == 4){
        // floor decoration
        if(r < 0.125){        // 12.5%
          sprite = ['tilemap', 'skull-0'];
        } else if(r < 0.25){  // 12.5%
          sprite = ['tilemap', 'skull-1'];
        } else if(r < 0.375){ // 12.5%
          sprite = ['tilemap', 'mushroom-0'];
        } else if(r < 0.5){   // 12.5%
          sprite = ['tilemap', 'mushroom-1'];
        } else if(r < 0.625){ // 12.5%
          sprite = ['tilemap', 'sword-floor-0'];
        } else if(r < 0.75){  // 12.5%
          sprite = ['tilemap', 'sword-floor-1'];
        } else{               // 25%
          sprite = ['tilemap', 'table'];
          var topSprite = false;
          r = this.r.random();
          if(r < 0.17){        // 16.6%
            topSprite = ['tilemap', 'books-0'];
          } else if(r < 0.33){ // 16.6%
            topSprite = ['tilemap', 'books-1'];
          } else if(r < 0.5){  // 16.6%
            topSprite = ['tilemap', 'books-2'];
          } else if(r < 0.67){ // 16.6%
            topSprite = ['tilemap', 'books-3'];
          } else if(r < 0.83){ // 16.6%
            topSprite = ['tilemap', 'crown'];
          } else {             // 16.6%
            topSprite = ['tilemap', 'skull-0'];
          }
          if(topSprite){
            this.grid[this.getIndex(x, y - 1)].deco = this.getSprite(topSprite[0], topSprite[1]);
          }
        }
      } else if(y == 3){
        // background wall decoration
        if(r < 0.25){        // 25%
          sprite = ['tilemap', 'chain-0'];
        } else if(r < 0.5){  // 25%
          sprite = ['tilemap', 'chain-1'];
        } else if(r < 0.75){ // 25%
          sprite = ['tilemap', 'chain-2'];
        } else {             // 25%
          sprite = ['tilemap', 'chain-3'];
        }
      } else if(y == 1){
        if(x == 1 && this.walls.left){
          // top left corner
          sprite = ['tilemap', 'web-1'];
        }
        if(x == 4 && this.walls.right){
          // top right corner
          sprite = ['tilemap', 'web-0'];
        }
      }
    }
    if(sprite){
      this.grid[this.getIndex(x, y)].deco = this.getSprite(sprite[0], sprite[1]);
    }
  }

  /**
   * A helper function to reduce duplicated code, will create a sprite.
   * @see  http://pixijs.download/dev/docs/PIXI.Sprite.html
   * @param  {string} atlas the texture-atlas which should be used
   * @param  {string} id    the texture-id which should be used
   * @return {Sprite}       a new Pixi.js sprite
   */
  getSprite(atlas, id){
    return new PIXI.Sprite(this.store.lib.getTexture(atlas, id));
  }

}

export default Room;