var PIXI = require('pixi.js');

var Atlas = require('../utils/atlas.js');

class Torch extends PIXI.Container{

  constructor(r){
    super();
    this.d = {
      'scale': 3,
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
    this.atlas = new Atlas();
    this.light = new PIXI.Container();
    this.torch = new PIXI.Container();
    this.fire = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'fire-0'));
    this.fire.x = 3;
    this.fire.y = -2 * this.d.scale * this.d.size - 3;
    this.fire.width = this.d.scale * this.d.size;
    this.fire.height = this.d.scale * this.d.size;
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
    this.torch_0 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'torch-'+this.d.torchId+'-top'));
    this.torch_1 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'torch-'+this.d.torchId+'-middle'));
    this.torch_2 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'torch-'+this.d.torchId+'-bottom'));
    this.setPos(this.torch_0, 0,  0, 16, 16);
    this.setPos(this.torch_1, 0, 16, 16, 16);
    this.setPos(this.torch_2, 0, 32, 16, 16);
    this.torch.addChild(this.torch_0);
    this.torch.addChild(this.torch_1);
    this.torch.addChild(this.torch_2);
    this.torch.x = 0;
    this.torch.y = -2 * this.d.scale * this.d.size;
    this.light_0 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-top-left'));
    this.light_1 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-top'));
    this.light_2 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-top-right'));
    this.light_3 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-left'));
    this.light_4 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light'));
    this.light_5 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-right'));
    this.light_6 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-bottom-left'));
    this.light_7 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-bottom'));
    this.light_8 = new PIXI.Sprite(this.atlas.getTexture('tilemap', 'light-bottom-right'));
    this.addLight(this.light_0,  0,  0, 16, 16);
    this.addLight(this.light_1, 16,  0, 16, 16);
    this.addLight(this.light_2, 32,  0, 16, 16);
    this.addLight(this.light_3,  0, 16, 16, 16);
    this.addLight(this.light_4, 16, 16, 16, 16);
    this.addLight(this.light_5, 32, 16, 16, 16);
    this.addLight(this.light_6,  0, 32, 16, 16);
    this.addLight(this.light_7, 16, 32, 16, 16);
    this.addLight(this.light_8, 32, 32, 16, 16);
    this.light.x = -1 * this.d.scale * this.d.size;
    this.light.y = -3 * this.d.scale * this.d.size;
    this.torch.cacheAsBitmap = true;
    this.d.flicker.fireSpeed = 0.2 + 0.1* Math.random();
  }

  update(delta){
    //this.light.alpha = 0.1 + 0.9*Math.random();
    var f = this.d.flicker;
    f.fire += delta * f.fireSpeed;
    var frame = Math.floor(f.fire % f.frames);
    this.fire.texture = this.atlas.getTexture('tilemap', 'fire-'+frame);
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

  addLight(obj, x, y, width, height){
    this.setPos(obj, x, y, width, height);
    obj.blendMode = PIXI.BLEND_MODES.ADD;
    this.light.addChild(obj);
  }

  setPos(obj, x, y, width, height){
    obj.x = x * this.d.scale;
    obj.y = y * this.d.scale;
    obj.height = height * this.d.scale;
    obj.width = width * this.d.scale;
  }

}

module.exports = Torch