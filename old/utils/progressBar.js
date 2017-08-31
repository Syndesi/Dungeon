var PIXI = require('pixi.js');
var Atlas = require('./atlas.js');

/**
 * Creates a ProgressBar which can be used like any {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}.
 * @example
 * var bar = new ProgressBar(100, 0, 100, 0);
 * // the blue bar will now be 90% 
 * bar.setProgress(90);
 */
class ProgressBar extends PIXI.Container {

  /**
   * Creates a new ProgressBar
   * @param  {int}    width    the width of this component
   * @param  {int}    min      the smallest value this bar can show
   * @param  {int}    max      the highest value this bar can show
   * @param  {int}    progress the current value
   * @param  {String} color    one of these: red, orange, yellow, green, blue, purple, black, white
   * @param  {int}    scale    the scale of this element, by default 3
   */
  constructor(width = 80, min = 0, max = 100, progress = 33, color = 'blue', scale = 3){
    super();
    this.atlas = new Atlas();
    this.data = {
      'width': width,
      'height': 6,
      'borderWidth': 1,
      'min': min,
      'max': max,
      'progress': 0
    };
    var d = this.data;
    d.innerWidth = d.width - (2 * d.borderWidth);
    d.innerHeight = d.height - (2 * d.borderWidth);

    this.borderLeft          = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBarLeft'));
    this.borderMiddle        = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBarMiddle'));
    this.borderRight         = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBarRight'));
    this.barBackgroundLeft   = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBarBackgroundLeft'));
    this.barBackgroundMiddle = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBarBackgroundMiddle'));
    this.barBackgroundRight  = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBarBackgroundRight'));
    this.barLeft             = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBar'+color+'Left'));
    this.barMiddle           = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBar'+color+'Middle'));
    this.barRight            = new PIXI.Sprite(this.atlas.getTexture('gui', 'progressBar'+color+'Right'));
    //throw new ReferenceError('The color <'+color+'> is not specified to work with the progressBar.');
    this.addChild(this.borderMiddle);
    this.addChild(this.borderLeft);
    this.addChild(this.borderRight);
    this.addChild(this.barBackgroundMiddle);
    this.addChild(this.barBackgroundLeft);
    this.addChild(this.barBackgroundRight);
    this.addChild(this.barMiddle);
    this.addChild(this.barLeft);
    this.addChild(this.barRight);
    this.scale.set(scale);
    this.setProgress(progress);
  }

  /**
   * This function will update the component´s sprites and is automatically called by {@link ProgressBar#setProgress|setProgress}.
   */
  updatePos(){
    var d = this.data;
    this.setPos(         this.borderLeft,                                      0,             0,                                2 * d.borderWidth, d.height);
    this.setPos(       this.borderMiddle,                      2 * d.borderWidth,             0,                      d.width - 4 * d.borderWidth, d.height);
    this.setPos(        this.borderRight,            d.width - 2 * d.borderWidth,             0,                                2 * d.borderWidth, d.height);
    this.setPos(  this.barBackgroundLeft,     d.borderWidth + d.progressBarWidth, d.borderWidth,                                    d.borderWidth, d.innerHeight);
    this.setPos(this.barBackgroundMiddle, 2 * d.borderWidth + d.progressBarWidth, d.borderWidth, d.width - d.progressBarWidth - 4 * d.borderWidth, d.innerHeight);
    this.setPos( this.barBackgroundRight,            d.width - 2 * d.borderWidth, d.borderWidth,                                    d.borderWidth, d.innerHeight);
    this.setPos(            this.barLeft,                          d.borderWidth, d.borderWidth,                                    d.borderWidth, d.innerHeight);
    this.setPos(          this.barMiddle,                      2 * d.borderWidth, d.borderWidth,           d.progressBarWidth - 2 * d.borderWidth, d.innerHeight);
    this.setPos(           this.barRight,                     d.progressBarWidth, d.borderWidth,                                    d.borderWidth, d.innerHeight);
    if(d.progressBarWidth <= 3){
      this.barLeft.visible   = false;
      this.setPos(this.barMiddle, d.borderWidth, d.borderWidth, d.progressBarWidth, d.innerHeight);
      this.barRight.visible  = false;
    } else {
      this.barLeft.visible   = true;
      this.barRight.visible  = true;
    }
    if(d.innerWidth - d.progressBarWidth <= 3){
      this.barBackgroundLeft.visible   = false;
      this.setPos(this.barBackgroundMiddle, d.borderWidth + d.progressBarWidth, d.borderWidth, d.innerWidth - d.progressBarWidth, d.innerHeight);
      this.barBackgroundRight.visible  = false;
    } else {
      this.barBackgroundLeft.visible   = true;
      this.barBackgroundRight.visible  = true;
    }
  }

  /**
   * This function will update the bar´s progress.<br>
   * @param {int} Progress the current progress. Values above max or under min will be cut.
   */
  setProgress(progress){
    var d = this.data;
    if(progress < d.min){
      progress = d.min;
    } else if(progress > d.max){
      progress = d.max;
    }
    d.progress = (progress - d.min) / (d.max - d.min);
    d.progressBarWidth = d.progress * d.innerWidth;
    this.updatePos();
  }

  /**
   * This function is used internally to reduce duplicated code.
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

module.exports = ProgressBar