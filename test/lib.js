import {assert} from 'chai';
import * as PIXI from 'pixi.js';

import Store from '../client/store.js';
import Lib from '../client/lib.js';

describe('Lib', function(){
  it('should initialize correctly', function(){
    var store = new Store();
    var lib   = new Lib(store);
    assert.instanceOf(lib.store, Store);
  });
  it('should be able to set the position of an object', function(){
    var store = new Store();
    var lib  = new Lib(store);
    var obj = {};
    lib.setPos(obj, 1, 2, 3, 4);
    assert.equal(obj.x, 1);
    assert.equal(obj.y, 2);
    assert.equal(obj.width, 3);
    assert.equal(obj.height, 4);
  });
  it('should be able to return textures', function(){
    var store = new Store();
    var lib  = new Lib(store);
    assert.instanceOf(lib.getTexture('no', 'texture'), PIXI.Texture);
  });
  it('should check if a texture is loaded or not', function(){
    var store = new Store();
    var lib  = new Lib(store);
    assert.equal(lib.isTexture('no', 'texture'), false);
  });
});