import * as PIXI from 'pixi.js';

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
   * @param  {string} color    one of these: Red, Orange, Yellow, Green, Blue, Purple, Black, White
   */
  constructor(store, width = 80, min = 0, max = 100, progress = 33, color = 'Blue'){
    super();
    this.data = {
      'store': store,
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

    var s = this.data.store;
    this.borderLeft          = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBarLeft'));
    this.borderMiddle        = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBarMiddle'));
    this.borderRight         = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBarRight'));
    this.barBackgroundLeft   = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBarBackgroundLeft'));
    this.barBackgroundMiddle = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBarBackgroundMiddle'));
    this.barBackgroundRight  = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBarBackgroundRight'));
    this.barLeft             = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBar'+color+'Left'));
    this.barMiddle           = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBar'+color+'Middle'));
    this.barRight            = new PIXI.Sprite(s.lib.getTexture('gui', 'progressBar'+color+'Right'));
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
    this.scale.set(s.scale);
    this.setProgress(progress);
  }

  update(delta, progress = false){
    if(progress !== false){
      this.setProgress(progress);
    }
    this.updatePos();
  }

  /**
   * This function will update the component´s sprites and is automatically called by {@link ProgressBar#setProgress|setProgress}.
   */
  updatePos(){
    var d = this.data;
    var s = d.store;
    var bw = d.borderWidth;
    var ih = d.innerHeight;
    var w = d.width;
    var h = d.height;
    var p = d.progressBarWidth;
    s.lib.setPos(         this.borderLeft,          0,  0,         2 * bw, h);
    s.lib.setPos(       this.borderMiddle,     2 * bw,  0,     w - 4 * bw, h);
    s.lib.setPos(        this.borderRight, w - 2 * bw,  0,         2 * bw, h);
    s.lib.setPos(  this.barBackgroundLeft,     bw + p, bw,             bw, ih);
    s.lib.setPos(this.barBackgroundMiddle, 2 * bw + p, bw, w - p - 4 * bw, ih);
    s.lib.setPos( this.barBackgroundRight, w - 2 * bw, bw,             bw, ih);
    s.lib.setPos(            this.barLeft,         bw, bw,             bw, ih);
    s.lib.setPos(          this.barMiddle,     2 * bw, bw,     p - 2 * bw, ih);
    s.lib.setPos(           this.barRight,          p, bw,             bw, ih);
    if(p <= 3){
      this.barLeft.visible   = false;
      s.lib.setPos(this.barMiddle, bw, bw, p, ih);
      this.barRight.visible  = false;
    } else {
      this.barLeft.visible   = true;
      this.barRight.visible  = true;
    }
    if(d.innerWidth - p <= 3){
      this.barBackgroundLeft.visible   = false;
      s.lib.setPos(this.barBackgroundMiddle, bw + p, bw, d.innerWidth - p, ih);
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

}

export default ProgressBar;