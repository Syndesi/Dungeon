import Lib from './lib.js';

import Keyboard from './util/keyboard.js';
import Level from './util/level.js';
import Room from './util/room.js';
import Inventory from './util/inventory.js';

class Store {

  game    = null; // PIXI
  stage   = null; // PIXI.Container
  lib     = null;
  scale   = 3;
  el      = null; // DOM-Node
  level   = null; // PIXI.Container
  width   = 800;
  height  = 500;
  debug   = false;
  context = 'level';
  player = {
    'health': 8,
    'maxHealth': 10,
    'coins': 0,
    'position': {
      'x': 0,
      'y': 0
    }
  };

  constructor(el){
    this.lib = new Lib(this);
    this.el = el;
    //for(var i = 0;i < 4 * 9;i++){
    //  this.data.inventory.items[i] = null;
    //}
  }

  update(delta){
    this.key.update();
    this.inventory.update(delta);
    this.level.update(delta);
    this.game.render(this.stage);
  }

  init(){
    this.key = new Keyboard(this);
    this.addLevelKeyEvents();

    this.level = new Level(this, '3', 8, 8);
    this.level.level.x = 0;
    this.level.level.y = 0;
    this.stage.addChild(this.level.level);

    this.gui = new PIXI.Container();
    this.stage.addChild(this.gui);

    this.inventory = new Inventory(this);
    this.gui.addChild(this.inventory);

    this.game.render(this.stage);
  }

  addLevelKeyEvents(){
    this.key.addKeyPress('level', 'w', () => {
      this.level.moveUp();
    });
    this.key.addKeyPress('level', 'd', () => {
      this.level.moveRight();
    });
    this.key.addKeyPress('level', 's', () => {
      this.level.moveDown();
    });
    this.key.addKeyPress('level', 'a', () => {
      this.level.moveLeft();
    });
    this.key.addKeyPress('level', 'up', () => {
      this.level.moveUp();
    });
    this.key.addKeyPress('level', 'right', () => {
      this.level.moveRight();
    });
    this.key.addKeyPress('level', 'down', () => {
      this.level.moveDown();
    });
    this.key.addKeyPress('level', 'left', () => {
      this.level.moveLeft();
    });
    this.key.addKeyPress('level', 'space', () => {
      this.level.moveUp();
    });
    // special keys
    this.key.addKeyDown('level', 'esc', () => {
      console.log('open menu');
    });
  }

}

export default Store;