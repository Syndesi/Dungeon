import Lib from './lib.js';
import Keyboard from './util/keyboard.js';
import Level from './util/level.js';
import Room from './util/room.js';
import Inventory from './util/inventory.js';

/**
 * The store is used to calculate and store things which should be globally available.
 */
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
  levelSize = {'x': 8, 'y': 8};
  player = {
    'health': 10,
    'maxHealth': 10,
    'coins': 0
  };

  /**
   * @param  {DOM-node} el the element to which the game is bound to
   */
  constructor(el){
    this.lib = new Lib(this);
    this.el = el;
  }

  /**
   * This function will be called when the player enters the room with the exit-door.
   */
  resetLevel(){
    this.player.coins += 100;
    this.player.health = 10;
    this.stage.removeChildren();
    this.level = new Level(this, Math.random(), this.levelSize.x, this.levelSize.y);
    this.level.level.x = 0;
    this.level.level.y = 0;
    this.stage.addChild(this.level.level);
    this.stage.addChild(this.gui);
  }

  /**
   * This is the game-loop.
   * @param  {float} delta the time since the last frame
   */
  update(delta){
    this.key.update();
    this.inventory.update(delta);
    this.level.update(delta);
    this.game.render(this.stage);
  }

  /**
   * This function will initialize every graphic.
   */
  init(){
    this.key = new Keyboard(this);
    this.addLevelKeyEvents();
    // level
    this.level = new Level(this, Math.random(), this.levelSize.x, this.levelSize.y);
    this.level.level.x = 0;
    this.level.level.y = 0;
    this.stage.addChild(this.level.level);
    // gui
    this.gui = new PIXI.Container();
    this.stage.addChild(this.gui);
    this.inventory = new Inventory(this);
    this.gui.addChild(this.inventory);
    // render
    this.game.render(this.stage);
  }

  /**
   * Just adds keyboard-events to the canvas
   */
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