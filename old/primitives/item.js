var PIXI = require('pixi.js');
var Atlas = require('../utils/atlas.js');
var Text = require('./text.js');
var Tooltip = require('./tooltip.js');

/**
 * This is the prototype-class for every Item in this game.
 * @example
 * var item = new Item(0, {});
 * this.game.addChild(item);
 */
class Item extends PIXI.Container {

  constructor(id, config){
    super();
    this.atlas = new Atlas();
    this.data = {
      'id': id,
      'tooltip': {
        'text': "<o><e>012</e> <c>Daemonic Sword</c></o>\nDies ist ein <9>Tooltip</9> :D\nder über mehrere Zeilen geht xD",
        'background': 'Black',
        'offset': {
          'x': 12,
          'y': 0
        }
      }
    };
    this.item = new PIXI.Sprite(this.atlas.getTexture('texture', 'tile-4-6'));
    this.item.scale.set(3);
    //console.log(new PIXI.Sprite(this.atlas.getTexture('texture', 'tile-4-6')));
    this.addChild(this.item);
    this.text = new Text('64', 48, 48, 8);
    this.text.x = 48 - this.text.width;
    this.text.y = 48 - this.text.height;
    this.addChild(this.text);
    this.tooltip = new Tooltip(this.data.tooltip.text, this.data.tooltip.background);
    this.addChild(this.tooltip);
    this.tooltip.visible = false;
    this.interactive = true;
    this.buttonMode = true;
    this.pivot.set(0.5);
    this.isDragging = false;
    this
      // events for drag start
      .on('mousedown', this.onDragStart, this)
      .on('touchstart', this.onDragStart, this)
      // events for drag end
      .on('mouseup', this.onDragEnd, this)
      .on('mouseupoutside', this.onDragEnd, this)
      .on('touchend', this.onDragEnd, this)
      .on('touchendoutside', this.onDragEnd, this)
      // events for drag move
      .on('mousemove', this.onDragMove, this)
      .on('touchmove', this.onDragMove, this)
      // events for displaying the tooltip
      .on('mouseover', this.onMouseOver, this)
      .on('mouseout', this.onMouseOut, this);
  }

  /**
   * Updates the text in the item´s tooltip.
   * @param {string} text the new text for the tooltip
   * @example
   * var item = new Item(1, {});
   * game.addChild(item);
   * item.setText('I´m the new tooltip! :D');
   */
  setText(text){
    this.tooltip.setText(text);
  }

  /**
   * This is an internal function which allows to drag items around
   */
  onDragStart(e){
    this.isDragging = true;
    this.data.dragging = e.data;
    this.tooltip.visible = false;
    var pos = this.data.dragging.getLocalPosition(this.parent);
    this.data.dragging.offset = {
      'x': pos.x - this.x,
      'y': pos.y - this.y
    };
    this.alpha = 0.5;
  }

  /**
   * This is an internal function which allows to drag items around
   */
  onDragEnd(e){
    this.isDragging = false;
    this.data.dragging = null;
    this.alpha = 1;
    this.tooltip.visible = true;
  }

  /**
   * This is an internal function which allows to drag items around
   */
  onDragMove(e){
    if(this.isDragging){
      var pos = this.data.dragging.getLocalPosition(this.parent);
      this.x = pos.x - this.data.dragging.offset.x;
      this.y = pos.y - this.data.dragging.offset.y;
    }
    if(this.tooltip.visible){
      var pos = e.data.getLocalPosition(this.parent);
      this.tooltip.x = pos.x - this.x + this.data.tooltip.offset.x;
      this.tooltip.y = pos.y - this.y + this.data.tooltip.offset.y;
    }
  }

  /**
   * This is an internal function which allows to drag items around
   */
  onMouseOver(e){
    if(!this.isDragging){
      var pos = e.data.getLocalPosition(this.parent);
      this.tooltip.x = pos.x - this.x + this.data.tooltip.offset.x;
      this.tooltip.y = pos.y - this.y + this.data.tooltip.offset.y;
      this.tooltip.visible = true;
    }
  }

  /**
   * This is an internal function which allows to drag items around
   */
  onMouseOut(e){
    this.tooltip.visible = false;
  }

}

module.exports = Item