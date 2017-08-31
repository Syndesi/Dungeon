var PIXI = require('pixi.js');
var Atlas = require('../utils/atlas.js');
var Text = require('./text.js');

/**
 * Generates a Tooltip with a slightly transparent background.<br>
 * The text can be colored with special commands, visit therefore the {@link Text| text element}.<br>
 * Note: This class just implements tooltips, but it doesn´t implement hiding/showing the tooltip because that´s dependent of the use-case.
 * @example
 * var tooltip = new Tooltip('This is a tooltip with &ltc&gtcolored text&lt/c&gt!');
 */
class Tooltip extends PIXI.Container {

  /**
   * @param  {string} text  The text which should be displayed by the tooltip.
   * @param  {string} color One of these colors: ```red```, ```orange```, ```yellow```, ```green```, ```blue```, ```purple```, ```black```, ```white``` or empty for the default background
   */
  constructor(text = '', color = ''){
    super();
    this.atlas                 = new Atlas();
    this.pixelWidth            = 3;
    this.borderWidth           = 2 * this.pixelWidth;
    this.backgroundTopLeft     = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'TopLeft'));
    this.backgroundTop         = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'Top'));
    this.backgroundTopRight    = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'TopRight'));
    this.backgroundLeft        = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'Left'));
    this.backgroundMiddle      = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'Middle'));
    this.backgroundRight       = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'Right'));
    this.backgroundBottomLeft  = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'BottomLeft'));
    this.backgroundBottom      = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'Bottom'));
    this.backgroundBottomRight = new PIXI.Sprite(this.atlas.getTexture('gui', 'tooltipBackground'+color+'BottomRight'));
    this.text                  = new Text(text);
    //this.item.scale.set(3);
    this.backgroundTopLeft.alpha     = 0.9;
    this.backgroundTop.alpha         = 0.9;
    this.backgroundTopRight.alpha    = 0.9;
    this.backgroundLeft.alpha        = 0.9;
    this.backgroundMiddle.alpha      = 0.9;
    this.backgroundRight.alpha       = 0.9;
    this.backgroundBottomLeft.alpha  = 0.9;
    this.backgroundBottom.alpha      = 0.9;
    this.backgroundBottomRight.alpha = 0.9;
    this.addChild(this.backgroundTopLeft);
    this.addChild(this.backgroundTop);
    this.addChild(this.backgroundTopRight);
    this.addChild(this.backgroundLeft);
    this.addChild(this.backgroundMiddle);
    this.addChild(this.backgroundRight);
    this.addChild(this.backgroundBottomLeft);
    this.addChild(this.backgroundBottom);
    this.addChild(this.backgroundBottomRight);
    this.addChild(this.text);
    this.update();
  }

  /**
   * This will update the tooltip´s text.
   * @param {string} text the new text
   */
  setText(text){
    this.text.setText(text);
    this.update();
  }

  /**
   * This function will update all sprites so that the background wrapes around the text.
   */
  update(){
    var bw = this.borderWidth;
    var w  = this.text.width + this.pixelWidth * 2;
    var h  = this.text.height + this.pixelWidth * 2;
    this.setPos(    this.backgroundTopLeft,       0,       0, bw, bw);
    this.setPos(        this.backgroundTop,      bw,       0,  w, bw);
    this.setPos(   this.backgroundTopRight,  w + bw,       0, bw, bw);
    this.setPos(       this.backgroundLeft,       0,      bw, bw,  h);
    this.setPos(     this.backgroundMiddle,      bw,      bw,  w,  h);
    this.setPos(      this.backgroundRight,  w + bw,      bw, bw,  h);
    this.setPos( this.backgroundBottomLeft,       0,  h + bw, bw, bw);
    this.setPos(     this.backgroundBottom,      bw,  h + bw,  w, bw);
    this.setPos(this.backgroundBottomRight,  w + bw,  h + bw, bw, bw);
    this.text.x = this.pixelWidth * 3;
    this.text.y = this.pixelWidth * 3;
  }

  /**
   * A small helper function to reduce duplicated code.
   * @param {PIXI.Sprite} obj    the sprite which position should be updated, see {@link http://pixijs.download/dev/docs/PIXI.Sprite.html| PIXI.Sprite}
   * @param {int}         x      x
   * @param {int}         y      y
   * @param {int}         width  width
   * @param {int}         height height
   */
  setPos(obj, x, y, width, height){
    obj.x      = Math.abs(x);
    obj.y      = Math.abs(y);
    obj.width  = Math.abs(width);
    obj.height = Math.abs(height);
  }

}

module.exports = Tooltip