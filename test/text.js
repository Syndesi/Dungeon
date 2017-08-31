import {assert} from 'chai';
import * as PIXI from 'pixi.js';
import pixiMultistyleText from 'pixi-multistyle-text';

import Text from '../client/primitives/text.js';

describe('Text extends pixi-multistyle-text', function(){
  it('should initialize correctly', function(){
    var text = new Text('hello world');
    assert.instanceOf(text, pixiMultistyleText);
    assert.instanceOf(text, PIXI.Text);
    assert.equal(text.text, 'hello world');
  });
  it('should work with text and coordinates', function(){
    var text = new Text('test', 10, 12);
    assert.equal(text.text, 'test');
    assert.equal(text.position.x, 10);
    assert.equal(text.position.y, 12);
  });
  it('should allow to change it´s position', function(){
    var text = new Text('test');
    text.position.x = 100;
    text.position.y = 90;
    assert.equal(text.position.x, 100);
    assert.equal(text.position.y, 90);
  });
  it('should allow to change it´s text', function(){
    var text = new Text('test');
    text.text = 'new text';
    assert.equal(text.text, 'new text');
  });
});