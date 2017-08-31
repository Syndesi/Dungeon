var chai = require('chai');
var assert = chai.assert;
var PIXI = require('pixi.js');
var Atlas = require('../client/utils/atlas.js');


describe('Atlas', function(){
  it('should return a texture every time (even if it´s just white/empty)', function(){
    var atlas = new Atlas();
    var texture = atlas.getTexture('this-texture', 'does-not-exist');
    assert.instanceOf(texture, PIXI.Texture);
  });
  it('should return if a texture exist or not', function(){
    var atlas = new Atlas();
    var isTexture = atlas.isTexture('this-texture', 'does-not-exist');
    assert.equal(isTexture, false);
  });
});
