var chai = require('chai');
var assert = chai.assert;
var Quadtree = require('../client/utils/quadtree.js');


describe('Quadtree', function(){
  it('should initialize correctly', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    assert.equal(tree.data.x, 0);
    assert.equal(tree.data.y, 0);
    assert.equal(tree.data.width, 100);
    assert.equal(tree.data.height, 100);
    assert.equal(tree.data.level, 0);
    assert.instanceOf(tree.childs, Array);
    assert.equal(tree.childs.length, 0);
    assert.equal(tree.nodes, false);
  });
  it('should allow adding nodes', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    tree.insert({'x':0, 'y':0, 'width':10, 'height':10});
    assert.equal(tree.childs.length, 1);
    assert.equal(tree.childs[0].width, 10);
    assert.equal(tree.childs[0].height, 10);
  });
  it('should not split until 10 children are added', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    tree.insert({'x': 0, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':45, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':90, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':45, 'width':10, 'height':10});
    tree.insert({'x':45, 'y':45, 'width':10, 'height':10});
    tree.insert({'x':90, 'y':45, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':90, 'width':10, 'height':10});
    tree.insert({'x':45, 'y':90, 'width':10, 'height':10});
    tree.insert({'x':90, 'y':90, 'width':10, 'height':10});
    assert.equal(tree.childs.length, 9);
    assert.equal(tree.nodes, false);
  });
  it('should split when 10 children are added', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    tree.insert({'x': 0, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':45, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':90, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':45, 'width':10, 'height':10});
    tree.insert({'x':45, 'y':45, 'width':10, 'height':10});
    tree.insert({'x':90, 'y':45, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':90, 'width':10, 'height':10});
    tree.insert({'x':45, 'y':90, 'width':10, 'height':10});
    tree.insert({'x':90, 'y':90, 'width':10, 'height':10});
    tree.insert({'x':10, 'y':10, 'width':10, 'height':10});
    assert.equal(tree.childs.length, 5);
    assert.instanceOf(tree.nodes, Array);
    assert.equal(tree.nodes.length, 4);
    assert.equal(tree.nodes[0].childs.length, 2); // top left node should have 2 children
    assert.equal(tree.nodes[1].childs.length, 1); // bottom left node should have 1 child
    assert.equal(tree.nodes[2].childs.length, 1); // bottom right node should have 1 child
    assert.equal(tree.nodes[3].childs.length, 1); // top right node should have 1 child
  });
  it('should recursively split when 10 children are added in the same corner', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    tree.insert({'x': 0, 'y': 0, 'width':10, 'height':10}); // <-  1   |   1  2  3  -  -  -  -  -  -  -
    tree.insert({'x':10, 'y': 0, 'width':10, 'height':10}); // <-  2   |   4  5  6  -  -  -  -  -  -  -
    tree.insert({'x':20, 'y': 0, 'width':10, 'height':10}); // <-  3   |   7  8  9  -  -  -  -  -  -  -
    tree.insert({'x': 0, 'y':10, 'width':10, 'height':10}); // <-  4   |  10  -  -  -  -  -  -  -  -  -
    tree.insert({'x':10, 'y':10, 'width':10, 'height':10}); // <-  5   |   -  -  -  -  -  -  -  -  -  -
    tree.insert({'x':20, 'y':10, 'width':10, 'height':10}); // <-  6   |   -  -  -  -  -  -  -  -  -  -
    tree.insert({'x': 0, 'y':20, 'width':10, 'height':10}); // <-  7   |   -  -  -  -  -  -  -  -  -  -
    tree.insert({'x':10, 'y':20, 'width':10, 'height':10}); // <-  8   |   -  -  -  -  -  -  -  -  -  -
    tree.insert({'x':20, 'y':20, 'width':10, 'height':10}); // <-  9   |   -  -  -  -  -  -  -  -  -  -
    tree.insert({'x': 0, 'y':30, 'width':10, 'height':10}); // <- 10   |   -  -  -  -  -  -  -  -  -  -
    assert.equal(tree.childs.length, 0);
    assert.instanceOf(tree.nodes, Array);
    assert.equal(tree.nodes.length, 4);
    assert.equal(tree.nodes[0].childs.length, 5);          // top left node should have 2 children
    assert.equal(tree.nodes[1].childs.length, 0);          // bottom left node should have 1 child
    assert.equal(tree.nodes[2].childs.length, 0);          // bottom right node should have 1 child
    assert.equal(tree.nodes[3].childs.length, 0);          // top right node should have 1 child
    assert.equal(tree.nodes[0].nodes[0].childs.length, 4); // the top left node of the top left node should have 4 children
    assert.equal(tree.nodes[0].nodes[1].childs.length, 1); // the bottom left node of the top left node should have 1 child
    assert.equal(tree.nodes[0].nodes[2].childs.length, 0); // the bottom right node of the top left node should have no children
    assert.equal(tree.nodes[0].nodes[3].childs.length, 0); // the top right node of the top left node should have no children
  });
  it('should return possible collisions', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    tree.insert({'x': 0, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':10, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':20, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':10, 'width':10, 'height':10});
    tree.insert({'x':10, 'y':10, 'width':10, 'height':10});
    tree.insert({'x':20, 'y':10, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':20, 'width':10, 'height':10});
    tree.insert({'x':10, 'y':20, 'width':10, 'height':10});
    tree.insert({'x':20, 'y':20, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':30, 'width':10, 'height':10});
    var res = tree.retrieve({'x': 0, 'y': 0, 'width':10, 'height':10});
    assert.equal(res.length, 9);
    var res = tree.retrieve({'x': 40, 'y': 0, 'width':10, 'height':10});
    assert.equal(res.length, 5);
    var res = tree.retrieve({'x': 90, 'y': 90, 'width':10, 'height':10});
    assert.equal(res.length, 0);
  });
  it('should return actual collisions (not, partially and completely aligned)', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    tree.insert({'x': 0, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':10, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x':20, 'y': 0, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':10, 'width':10, 'height':10});
    tree.insert({'x':10, 'y':10, 'width':10, 'height':10});
    tree.insert({'x':20, 'y':10, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':20, 'width':10, 'height':10});
    tree.insert({'x':10, 'y':20, 'width':10, 'height':10});
    tree.insert({'x':20, 'y':20, 'width':10, 'height':10});
    tree.insert({'x': 0, 'y':30, 'width':10, 'height':10});
    var res = tree.getCollisions({'x': 5, 'y': 5, 'width':10, 'height':10});
    assert.equal(res.length, 4);
    var res = tree.getCollisions({'x': 0, 'y': 5, 'width':10, 'height':10});
    assert.equal(res.length, 2);
    var res = tree.getCollisions({'x': 0, 'y': 0, 'width':10, 'height':10});
    assert.equal(res.length, 1);
  });
  it('should check if two objects are colliding', function(){
    var tree = new Quadtree(0, 0, 100, 100);
    var obj1 = {'x':  0, 'y': 0, 'width':10, 'height':10};
    var obj2 = {'x':  5, 'y': 0, 'width':10, 'height':10};
    var obj3 = {'x': 10, 'y': 0, 'width':10, 'height':10};
    var res1 = tree.areColliding(obj1, obj2);
    var res2 = tree.areColliding(obj2, obj3);
    var res3 = tree.areColliding(obj1, obj3);
    assert.equal(res1, true);
    assert.equal(res2, true);
    assert.equal(res3, false);
  });
});
