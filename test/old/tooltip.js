var chai = require('chai');
var assert = chai.assert;
var PIXI = require('pixi.js');
var Tooltip = require('../client/primitives/tooltip.js');
var Text = require('../client/primitives/text.js');


describe('Tooltip extends PIXI.Container', function(){
  it('should initialize correctly', function(){
    var tooltip = new Tooltip('text');
    //assert.equal(item.data.id, 1);
    assert.instanceOf(tooltip, PIXI.Container);
    assert.instanceOf(tooltip.text, Text);
  });
  it('should have all assets loaded', function(){
    var tooltip = new Tooltip('text');
    var alpha = 0.9;
    assert.instanceOf(tooltip.backgroundTopLeft,     PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundTop,         PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundTopRight,    PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundLeft,        PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundMiddle,      PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundRight,       PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundBottomLeft,  PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundBottom,      PIXI.Sprite);
    assert.instanceOf(tooltip.backgroundBottomRight, PIXI.Sprite);
    assert.equal(tooltip.backgroundTopLeft.alpha,     alpha);
    assert.equal(tooltip.backgroundTop.alpha,         alpha);
    assert.equal(tooltip.backgroundTopRight.alpha,    alpha);
    assert.equal(tooltip.backgroundLeft.alpha,        alpha);
    assert.equal(tooltip.backgroundMiddle.alpha,      alpha);
    assert.equal(tooltip.backgroundRight.alpha,       alpha);
    assert.equal(tooltip.backgroundBottomLeft.alpha,  alpha);
    assert.equal(tooltip.backgroundBottom.alpha,      alpha);
    assert.equal(tooltip.backgroundBottomRight.alpha, alpha);
  });
  it('setPos should work correctly (and don´t set negative values)', function(){
    var tooltip = new Tooltip('text');
    var obj = {};
    tooltip.setPos(obj, 1, 2, 3, 4);
    assert.equal(obj.x, 1);
    assert.equal(obj.y, 2);
    assert.equal(obj.width, 3);
    assert.equal(obj.height, 4);
    tooltip.setPos(obj, -1, -2, -3, -4);
    assert.equal(obj.x, 1);
    assert.equal(obj.y, 2);
    assert.equal(obj.width, 3);
    assert.equal(obj.height, 4);
  });
  it('should allow to change it´s text', function(){
    var tooltip = new Tooltip('text');
    var oldWidth = tooltip.width;
    // this is needed because .setText(text) triggers warnings which don't make sense -> I can't figure out how to remove it's cause
    console.warn = function(text){};
    tooltip.setText('this is a very long text');
    assert.isAbove(tooltip.width, oldWidth, 'longer text should create a bigger background');
    assert.equal(tooltip.text.text, 'this is a very long text');
  });
});
