var chai = require('chai');
var assert = chai.assert;
var mock = require('mock-require');

class mstMock {
  constructor(text, config){
    this.text = text;
    this.config = config;
    this.position = {
      'x': 0,
      'y': 0
    };
  }
}
 
mock('pixi-multistyle-text', mstMock);
var Text = require('../client/primitives/text.js');


describe('Text extends pixi-multistyle-text', function(){
  it('should work with only the text given', function(){
    var text = new Text('test');
    assert.equal(text.text, 'test');
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
