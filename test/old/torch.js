var chai = require('chai');
var assert = chai.assert;
var PIXI = require('pixi.js');
var Torch = require('../client/primitives/torch.js');


describe('Torch extends PIXI.Container', function(){
  it('should initialize correctly', function(){
    var torch = new Torch();
    assert.equal(torch.d.scale, 3);
    assert.equal(torch.d.size, 16);
    assert.isAtLeast(torch.d.flicker.fireSpeed, 0.2);
    assert.isAtMost(torch.d.flicker.fireSpeed, 0.3);
    assert.instanceOf(torch, PIXI.Container);
    assert.instanceOf(torch.fire, PIXI.Sprite);
    assert.instanceOf(torch.light, PIXI.Container);
    assert.equal(torch.light.x, -1 * torch.d.scale * torch.d.size);
    assert.equal(torch.light.y, -3 * torch.d.scale * torch.d.size);
    assert.instanceOf(torch.torch, PIXI.Container);
    assert.equal(torch.torch.x, 0);
    assert.equal(torch.torch.y, -2 * torch.d.scale * torch.d.size);
    assert.equal(torch.torch.cacheAsBitmap, true);
  });
  it('setPos should work', function(){
    var torch = new Torch();
    var obj = {'x': 0, 'y': 0, 'width': 0, 'height': 0};
    torch.setPos(obj, 1, 2, 3, 4);
    assert.equal(obj.x, 1 * torch.d.scale);
    assert.equal(obj.y, 2 * torch.d.scale);
    assert.equal(obj.width, 3 * torch.d.scale);
    assert.equal(obj.height, 4 * torch.d.scale);
  });
  it('addLight should work', function(){
    var torch = new Torch();
    var sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    torch.addLight(sprite, 0, 0, 16, 16);
    assert.equal(sprite.blendMode, PIXI.BLEND_MODES.ADD);
  });
});
