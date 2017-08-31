import * as PIXI from 'pixi.js';

/**
 * The animated torch which lit every room in this game.
 */
class Torch extends PIXI.Container{

  /**
   * Creates a new Torch.
   * @param {object} store the game´s store
   * @param {float} r this number will determine which texture is used by the torch
   */
  constructor(store, r){
    super();
    this.d = {
      'size': 16,
      'flicker': {
        'steps': 1,
        'current': 1,
        'deltaAlpha': 0.5,
        'fire': 0,
        'frames': 16,
        'fireSpeed': 0
      },
      'torchId': 0
    };
    this.store = store;
    var s = this.store;
    var scale = s.scale;
    this.light = new PIXI.Container();
    this.torch = new PIXI.Container();
    this.fire = new PIXI.Sprite(s.lib.getTexture('tilemap', 'fire-0'));
    this.fire.x = 3;
    this.fire.y = -2 * scale * this.d.size - 3;
    this.fire.width = scale * this.d.size;
    this.fire.height = scale * this.d.size;
    this.addChild(this.fire);
    this.addChild(this.torch);
    this.addChild(this.light);
    if(r < 0.8){        // 80%
      this.d.torchId = 0;
    } else if(r < 0.9){ // 10%
      this.d.torchId = 1;
    } else {            // 10%
      this.d.torchId = 2;
    }
    this.torch_0 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'torch-'+this.d.torchId+'-top'));
    this.torch_1 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'torch-'+this.d.torchId+'-middle'));
    this.torch_2 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'torch-'+this.d.torchId+'-bottom'));
    s.lib.setPos(this.torch_0, 0 * scale,  0 * scale, 16 * scale, 16 * scale);
    s.lib.setPos(this.torch_1, 0 * scale, 16 * scale, 16 * scale, 16 * scale);
    s.lib.setPos(this.torch_2, 0 * scale, 32 * scale, 16 * scale, 16 * scale);
    this.torch.addChild(this.torch_0);
    this.torch.addChild(this.torch_1);
    this.torch.addChild(this.torch_2);
    this.torch.x = 0;
    this.torch.y = -2 * scale * this.d.size;
    this.light_0 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-top-left'));
    this.light_1 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-top'));
    this.light_2 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-top-right'));
    this.light_3 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-left'));
    this.light_4 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light'));
    this.light_5 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-right'));
    this.light_6 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-bottom-left'));
    this.light_7 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-bottom'));
    this.light_8 = new PIXI.Sprite(s.lib.getTexture('tilemap', 'light-bottom-right'));
    this.addLight(this.light_0,  0,  0, 16, 16);
    this.addLight(this.light_1, 16,  0, 16, 16);
    this.addLight(this.light_2, 32,  0, 16, 16);
    this.addLight(this.light_3,  0, 16, 16, 16);
    this.addLight(this.light_4, 16, 16, 16, 16);
    this.addLight(this.light_5, 32, 16, 16, 16);
    this.addLight(this.light_6,  0, 32, 16, 16);
    this.addLight(this.light_7, 16, 32, 16, 16);
    this.addLight(this.light_8, 32, 32, 16, 16);
    this.light.x = -1 * scale * this.d.size;
    this.light.y = -3 * scale * this.d.size;
    this.torch.cacheAsBitmap = true;
    this.d.flicker.fireSpeed = 0.2 + 0.1* Math.random();
  }

  /**
   * Will be run by the game-loop to updates the animation.
   * @param {float} delta the time since the last frame
   */
  update(delta){
    //this.light.alpha = 0.1 + 0.9*Math.random();
    var f = this.d.flicker;
    f.fire += delta * f.fireSpeed;
    var frame = Math.floor(f.fire % f.frames);
    this.fire.texture = this.store.lib.getTexture('tilemap', 'fire-'+frame);
    if(f.fire > f.frames){
      f.fire -= f.frames;
    }
    if(f.current < f.steps){
      this.light.alpha += f.deltaAlpha;
      f.current++;
    } else {
      var nextAlpha = 0.3 + 0.2 * Math.random();
      f.steps = 3 + Math.floor(Math.random()*3);
      f.deltaAlpha = (nextAlpha - this.light.alpha) / f.steps;
      this.light.alpha += f.deltaAlpha;
      f.current = 1;
    }
  }

  /**
   * Helper function the reduce duplicated code.
   * @param {object} obj    the sprite which should be added
   * @param {int}    x      the x-coordinate
   * @param {int}    y      the y-coordinate
   * @param {int}    width  the width of the sprite
   * @param {int}    height the height of the sprite
   */
  addLight(obj, x, y, width, height){
    var scale  = this.store.scale;
    this.store.lib.setPos(obj, x * scale, y * scale, width * scale, height * scale);
    obj.blendMode = PIXI.BLEND_MODES.ADD;
    this.light.addChild(obj);
  }

}

export default Torch;