import {assert} from 'chai';
import * as PIXI from 'pixi.js';

import Store from '../client/store.js';
import Room from '../client/util/room.js';
import Grid from '../client/util/grid.js';

describe('Room extends Grid', function(){
  it('should initialize correctly', function(){
    var store = new Store();
    var walls = {
      'top':    true,
      'right':  true,
      'bottom': true,
      'left':   true
    };
    var room  = new Room(store, walls, 'seed');
    assert.instanceOf(room, Grid);
    assert.instanceOf(room.store, Store);
    assert.equal(room.walls.length, walls.length);
    assert.equal(room.scale, store.scale);
    assert.equal(room.size, 16);
    assert.equal(room.chest, false);
    assert.instanceOf(room.grid, Array);
    assert.equal(room.grid.length, 36);
    assert.instanceOf(room.room, PIXI.Container);
    assert.instanceOf(room.bg, PIXI.Container);
    assert.instanceOf(room.deco, PIXI.Container);
    assert.instanceOf(room.fg, PIXI.Container);
    assert.equal(room.bg.cacheAsBitmap, true);
    assert.equal(room.fg.cacheAsBitmap, true);
    assert.equal(room.width, 6);
    assert.equal(room.height, 6);
  });
  it('should be able to update', function(){
    var store = new Store();
    var walls = {'top': true,'right': true,'bottom': true,'left': true};
    var room  = new Room(store, walls, 'seed');
    class tmp {
      constructor(){
        this.delta = 0;
      }
      update(delta){
        this.delta = delta;
      }
    }
    room.animated[0] = new tmp();
    room.update(1.23);
    assert.equal(room.animated[0].delta, 1.23);
  });
  it('should be able to set it´s cache', function(){
    var store = new Store();
    var walls = {'top': true,'right': true,'bottom': true,'left': true};
    var room  = new Room(store, walls, 'seed');
    room.setCache(true);
    assert.equal(room.bg.cacheAsBitmap, true);
    assert.equal(room.fg.cacheAsBitmap, true);
    room.setCache(false);
    assert.equal(room.bg.cacheAsBitmap, false);
    assert.equal(room.fg.cacheAsBitmap, false);
  });
  it('should be able to add blocks', function(){
    var store     = new Store();
    var walls     = {'top': true,'right': true,'bottom': true,'left': true};
    var room      = new Room(store, walls, 'seed');
    var block     = new PIXI.Sprite(store.lib.getTexture('no', 'texture'));
    var container = new PIXI.Container();
    room.addBlock(container, block, 2, 3);
    assert.equal(container.children.length, 1);
    assert.equal(block.x, 2 * 3 * 16);
    assert.equal(block.y, 3 * 3 * 16);
    assert.equal(block.width, 3 * 16);
    assert.equal(block.height, 3 * 16);
  });
  it('should be able to create a sprite on-the-fly', function(){
    var store = new Store();
    var walls = {'top': true,'right': true,'bottom': true,'left': true};
    var room  = new Room(store, walls, 'seed');
    assert.instanceOf(room.getSprite('no', 'texture'), PIXI.Sprite);
  });

  // room generation
  it('should be able to generate torches', function(){
    var store     = new Store();
    var walls     = {'top': true,'right': true,'bottom': true,'left': true};
    var room      = new Room(store, walls, 'seed');
    room.animated = [];
    room.deco.removeChildren();
    room.generateTorches();
    // left torch
    assert.equal(room.grid[room.getIndex(1, 2)].deco, null);
    assert.equal(room.grid[room.getIndex(1, 3)].deco, null);
    assert.equal(room.grid[room.getIndex(1, 4)].deco, null);
    // right torch
    assert.equal(room.grid[room.getIndex(4, 2)].deco, null);
    assert.equal(room.grid[room.getIndex(4, 3)].deco, null);
    assert.equal(room.grid[room.getIndex(4, 4)].deco, null);
    // both torches
    assert.equal(room.animated.length, 2);
    assert.equal(room.deco.children.length, 2);
  });
  it('should be able to generate a chest if enabled', function(){
    var store = new Store();
    var walls = {'top': true,'right': true,'bottom': true,'left': true};
    var room  = new Room(store, walls, 'seed', true);
    room.generateChest();
    var leftTile = room.grid[room.getIndex(2, 4)].deco;
    var rightTile = room.grid[room.getIndex(3, 4)].deco;
    if(leftTile == null){
      assert.instanceOf(rightTile, PIXI.Sprite);
    } else {
      assert.instanceOf(leftTile, PIXI.Sprite);
    }
  });
  it('should be able to generate the background', function(){
    var store = new Store();
    var walls = {'top': true,'right': true,'bottom': true,'left': true};
    var room  = new Room(store, walls, 'seed');
    room.iterate((x, y) => {
      room.generateBackground(x, y);
      assert.instanceOf(room.grid[room.getIndex(x, y)].bg, PIXI.Sprite);
    });
  });
  it('should be able to generate the foreground', function(){
    var store = new Store();
    var walls = {'top': true,'right': true,'bottom': true,'left': true};
    var room  = new Room(store, walls, 'seed');
    assert.instanceOf(room.grid[room.getIndex(0, 0)].fg, PIXI.Sprite); // top left corner = wall
    assert.instanceOf(room.grid[room.getIndex(5, 0)].fg, PIXI.Sprite); // top right corner = wall
    assert.instanceOf(room.grid[room.getIndex(0, 5)].fg, PIXI.Sprite); // bottom left corner = wall
    assert.instanceOf(room.grid[room.getIndex(5, 5)].fg, PIXI.Sprite); // bottom right corner = wall
    assert.equal(room.grid[room.getIndex(2, 2)].fg, null);             // central tile = no wall
  });
  it('should be able to generate doors', function(){
    var store = new Store();
    var walls = {'top': false,'right': false,'bottom': false,'left': true};
    var room  = new Room(store, walls, 'seed');
    // top door
    assert.equal(room.grid[room.getIndex(2, 0)].fg, null);
    assert.equal(room.grid[room.getIndex(3, 0)].fg, null);
    assert.equal(room.grid[room.getIndex(2, 2)].fg.jumpable, true);
    assert.equal(room.grid[room.getIndex(3, 2)].fg.jumpable, true);
    // right door
    assert.equal(room.grid[room.getIndex(5, 1)].fg, null);
    assert.equal(room.grid[room.getIndex(5, 2)].fg, null);
    assert.equal(room.grid[room.getIndex(5, 3)].fg, null);
    assert.equal(room.grid[room.getIndex(5, 4)].fg, null);
    // bottom door
    assert.instanceOf(room.grid[room.getIndex(2, 5)].fg, PIXI.Sprite);
    assert.instanceOf(room.grid[room.getIndex(3, 5)].fg, PIXI.Sprite);
    assert.equal(room.grid[room.getIndex(2, 5)].fg.jumpable, true);
    assert.equal(room.grid[room.getIndex(3, 5)].fg.jumpable, true);
    // left door
    assert.equal(room.grid[room.getIndex(0, 1)].deco, null);
    assert.equal(room.grid[room.getIndex(0, 2)].deco, null);
    assert.equal(room.grid[room.getIndex(0, 3)].deco, null);
    assert.equal(room.grid[room.getIndex(0, 4)].deco, null);
  });
});