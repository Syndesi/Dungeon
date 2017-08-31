var chai = require('chai');
var assert = chai.assert;
var PIXI = require('pixi.js');
var Item = require('../client/primitives/item.js');
var Tooltip = require('../client/primitives/tooltip.js');


describe('Item extends PIXI.Container', function(){
  it('should initialize correctly', function(){
    var item = new Item(1, {});
    assert.equal(item.data.id, 1);
    assert.instanceOf(item, PIXI.Container);
    assert.instanceOf(item.item, PIXI.Sprite);
    assert.equal(item.item.scale.x, 3);
    assert.equal(item.item.scale.y, 3);
    assert.instanceOf(item.tooltip, Tooltip);
    assert.equal(item.tooltip.visible, false);
    assert.equal(item.interactive, true);
    assert.equal(item.buttonMode, true);
    assert.equal(item.isDragging, false);
  });
  it('should allow to change it´s position', function(){
    var item = new Item(1, {});
    item.x = 123;
    item.y = 543;
    assert.equal(item.x, 123);
    assert.equal(item.y, 543);
  });
});
