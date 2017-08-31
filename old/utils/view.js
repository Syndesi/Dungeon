var PIXI = require('pixi.js');
var key = require('keyboardjs');


var Atlas = require('./atlas.js');
//var Inventory = require('../utils/inventory.js');
var Text = require('../primitives/text.js');
var ProgressBar = require('./progressBar.js');
var Item = require('../primitives/item.js');
var Room = require('../utils/room4.js');

var JungleRapier = require('../objects/weapons/jungleRapier.js');

class View {

  constructor(){
    this.d = {
      'speed': 3
    };
    this.atlas = new Atlas();
    this.view  = new PIXI.Container();

    key.setContext('game');
    var self = this;
    key.bind('w', function(e){
      self.moveUp(e);
    });
    key.bind('d', function(e){
      self.moveRight(e);
    });
    key.bind('s', function(e){
      self.moveDown(e);
    });
    key.bind('a', function(e){
      self.moveLeft(e);
    });
    key.bind('up', function(e){
      self.moveUp(e);
    });
    key.bind('right', function(e){
      self.moveRight(e);
    });
    key.bind('down', function(e){
      self.moveDown(e);
    });
    key.bind('left', function(e){
      self.moveLeft(e);
    });
  }

  moveUp(e){
    this.level.y += this.d.speed;
  }
  moveRight(e){
    this.level.x -= this.d.speed;
  }
  moveDown(e){
    this.level.y -= this.d.speed;
  }
  moveLeft(e){
    this.level.x += this.d.speed;
  }

  init(){
    this.level = new PIXI.Container();
    //this.inventory   = new Inventory();
    this.view.addChild(this.level);
    //this.view.addChild(this.inventory);
    this.p = 0;
    this.pb1 = new ProgressBar(102, 0, 100, 0, 'Red');
    this.pb1.x = 200;
    this.pb1.y = 100;
    //this.gui.addChild(this.pb1);

    var x = 50;
    this.room = new Room(false, false, true, true, x);
    this.level.addChild(this.room);
    this.room2 = new Room(true, false, false, false, x + 1);
    this.room2.x = 288;
    this.level.addChild(this.room2);
    this.room3 = new Room(false, true, true, false, x + 2);
    this.room3.x = 288;
    this.room3.y = 288;
    this.level.addChild(this.room3);
    this.room4 = new Room(true, false, true, false, x + 3);
    this.room4.y = 288;
    this.level.addChild(this.room4);
    this.room5 = new Room(true, false, true, false, x + 4);
    this.room5.x = 576;
    this.level.addChild(this.room5);
    this.room6 = new Room(true, false, true, true, x + 5);
    this.room6.x = 576;
    this.room6.y = 288;
    this.level.addChild(this.room6);




    //var item = new Item('sword', {});
    //this.gui.addChild(item);

    //var jungleRapier = new JungleRapier();
    //jungleRapier.y = 64;
    //this.gui.addChild(jungleRapier);
  }

  getContainer(){
    return this.view;
  }

  update(delta){
    this.p += delta * 0.2;
    //this.inventory.update(delta);
    this.room.update(delta);
    this.room2.update(delta);
    this.room3.update(delta);
    this.room4.update(delta);
    this.room5.update(delta);
    this.room6.update(delta);
    //this.level.x -= delta * 0.5;
    //this.pb1.setProgress((this.p) % 100);
    //console.log('updated');
  }

}

module.exports = View