import * as PIXI from 'pixi.js';
import Text from './text.js';

/**
 * Generates a Tooltip with a slightly transparent background.<br>
 * The text can be colored with special commands, visit therefore the {@link Text| text element}.<br>
 * Note: This class just implements tooltips, but it doesn´t implement hiding/showing the tooltip because that´s dependent of the use-case.
 * @example
 * var store = new Store();
 * var tooltip = new Tooltip(store, 'This is a tooltip with &ltc&gtcolored text&lt/c&gt!');
 */
class Tooltip extends PIXI.Container {

  /**
   * @param  {string} text  The text which should be displayed by the tooltip.
   * @param  {string} color One of these colors: ```Red```, ```Orange```, ```Yellow```, ```Green```, ```Blue```, ```Purple```, ```Black```, ```White``` or empty for the default background
   */
  constructor(store, text = '', color = '', alpha = 0.9){
    super();
    this.store                 = store;
    this.initialized           = false;
    var s                      = this.store;
    // adding the sprites for the background
    this.borderWidth           = s.scale * 2;
    this.backgroundTopLeft     = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'TopLeft'));
    this.backgroundTop         = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'Top'));
    this.backgroundTopRight    = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'TopRight'));
    this.backgroundLeft        = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'Left'));
    this.backgroundMiddle      = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'Middle'));
    this.backgroundRight       = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'Right'));
    this.backgroundBottomLeft  = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'BottomLeft'));
    this.backgroundBottom      = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'Bottom'));
    this.backgroundBottomRight = new PIXI.Sprite(s.lib.getTexture('gui', 'tooltipBackground'+color+'BottomRight'));
    this.setAlpha(alpha);
    this.addChild(this.backgroundTopLeft);
    this.addChild(this.backgroundTop);
    this.addChild(this.backgroundTopRight);
    this.addChild(this.backgroundLeft);
    this.addChild(this.backgroundMiddle);
    this.addChild(this.backgroundRight);
    this.addChild(this.backgroundBottomLeft);
    this.addChild(this.backgroundBottom);
    this.addChild(this.backgroundBottomRight);
    // adding the text
    this.text = new Text(text);
    this.addChild(this.text);
    // updating all positions
    this.initialized = true;
    this.update();
  }

  /**
   * This will update the tooltip´s text.
   * @param {string} text the new text
   */
  setText(text){
    this.text.text = text;
    this.update();
  }

  setAlpha(alpha){
    this.backgroundTopLeft.alpha     = alpha;
    this.backgroundTop.alpha         = alpha;
    this.backgroundTopRight.alpha    = alpha;
    this.backgroundLeft.alpha        = alpha;
    this.backgroundMiddle.alpha      = alpha;
    this.backgroundRight.alpha       = alpha;
    this.backgroundBottomLeft.alpha  = alpha;
    this.backgroundBottom.alpha      = alpha;
    this.backgroundBottomRight.alpha = alpha;
    this.update();
  }

  setColor(color){
    var l = this.store.lib;
    this.backgroundTopLeft.texture     = l.getTexture('gui', 'tooltipBackground'+color+'TopLeft');
    this.backgroundTop.texture         = l.getTexture('gui', 'tooltipBackground'+color+'Top');
    this.backgroundTopRight.texture    = l.getTexture('gui', 'tooltipBackground'+color+'TopRight');
    this.backgroundLeft.texture        = l.getTexture('gui', 'tooltipBackground'+color+'Left');
    this.backgroundMiddle.texture      = l.getTexture('gui', 'tooltipBackground'+color+'Middle');
    this.backgroundRight.texture       = l.getTexture('gui', 'tooltipBackground'+color+'Right');
    this.backgroundBottomLeft.texture  = l.getTexture('gui', 'tooltipBackground'+color+'BottomLeft');
    this.backgroundBottom.texture      = l.getTexture('gui', 'tooltipBackground'+color+'Bottom');
    this.backgroundBottomRight.texture = l.getTexture('gui', 'tooltipBackground'+color+'BottomRight');
    this.update();
  }

  /**
   * This function will update all sprites so that the background wrapes around the text.
   */
  update(){
    if(!this.initialized){
      return null;
    }
    var s  = this.store;
    var bw = this.borderWidth;
    var w  = this.text.width + s.scale * 2;
    var h  = this.text.height + s.scale * 2;
    s.lib.setPos(    this.backgroundTopLeft,       0,       0, bw, bw);
    s.lib.setPos(        this.backgroundTop,      bw,       0,  w, bw);
    s.lib.setPos(   this.backgroundTopRight,  w + bw,       0, bw, bw);
    s.lib.setPos(       this.backgroundLeft,       0,      bw, bw,  h);
    s.lib.setPos(     this.backgroundMiddle,      bw,      bw,  w,  h);
    s.lib.setPos(      this.backgroundRight,  w + bw,      bw, bw,  h);
    s.lib.setPos( this.backgroundBottomLeft,       0,  h + bw, bw, bw);
    s.lib.setPos(     this.backgroundBottom,      bw,  h + bw,  w, bw);
    s.lib.setPos(this.backgroundBottomRight,  w + bw,  h + bw, bw, bw);
    this.text.x = s.scale * 3;
    this.text.y = s.scale * 3;
  }
}

export default Tooltip;