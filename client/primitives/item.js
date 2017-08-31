import * as PIXI from 'pixi.js';
import Text from './text.js';
import Tooltip from './tooltip.js';

/**
 * This is the prototype-class for every Item in this game.
 */
class Item extends PIXI.Container {

  /**
   * Extends {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}.
   * @param  {object} store     the game´s store
   * @param  {string} atlas     the texture-atlas which should be used
   * @param  {string} id        the texture-id which should be used
   * @param  {string} text      the text shown by the tooltip
   * @param  {int}    stackSize the number of items in this stack
   * @param  {string} color     the background-color for it´s tooltip
   */
  constructor(store, atlas, id, text = false, stackSize = 1, color = 'Black'){
    super();
    this.data = {
      'store':      store,
      'atlas':      atlas,
      'id':         id,
      'text':       text || atlas+'-'+id,
      'stackSize':  stackSize,
      'background': color,
      'offset': {
        'x':        12,
        'y':        0
      }
    };
    var d = this.data;
    // the item itself
    this.item = new PIXI.Sprite(d.store.lib.getTexture(d.atlas, d.id));
    this.item.scale.set(d.store.scale);
    this.addChild(this.item);
    // the text displaying the stackSize
    this.text = new Text(d.stackSize, d.store.scale * 16, this.data.store.scale * 16, 8);
    this.addChild(this.text);
    this.setStackSize(d.stackSize);
    // the tooltip for displaying various data
    this.tooltip = new Tooltip(d.store, d.text, this.data.background);
    this.addChild(this.tooltip);
    this.tooltip.visible = false;
    // setting options to enable dragging
    this.interactive = true;
    this.buttonMode = true;
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
   */
  setText(text){
    this.tooltip.setText(text);
  }


  /**
   * Updates the color in the item´s tooltip.
   * @param {string} color the new color for the tooltip
   */
  setColor(color){
    this.tooltip.setColor(color);
  }

  /**
   * Updates the text in the item´s tooltip.
   * @param {string} text the new text for the tooltip
   */
  setStackSize(size){
    var d = this.data;
    d.stackSize = size;
    this.text.text = d.stackSize;
    this.text.x = d.store.scale * 16 - this.text.width;
    this.text.y = d.store.scale * 16 - this.text.height;
    if(d.stackSize <= 1){
      this.text.visible = false;
    } else {
      this.text.visible = true;
    }
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
      this.tooltip.x = pos.x - this.x + this.data.offset.x;
      this.tooltip.y = pos.y - this.y + this.data.offset.y;
    }
  }

  /**
   * This is an internal function which allows to drag items around
   */
  onMouseOver(e){
    if(!this.isDragging){
      var pos = e.data.getLocalPosition(this.parent);
      this.tooltip.x = pos.x - this.x + this.data.offset.x;
      this.tooltip.y = pos.y - this.y + this.data.offset.y;
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

export default Item;