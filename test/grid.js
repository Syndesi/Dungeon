import {assert} from 'chai';

import Grid from '../client/util/grid.js';

describe('Grid', function(){
  it('should initialize correctly', function(){
    var grid = new Grid();
    assert.equal(grid.width, 5);
    assert.equal(grid.height, 5);
    assert.instanceOf(grid.grid, Array);
  });
  it('should initialize correctly with parameters', function(){
    var grid = new Grid(7, 8);
    assert.equal(grid.width, 7);
    assert.equal(grid.height, 8);
  });
  it('should break with grids below 2x2', function(){
    assert.throws(() => new Grid(1, 1), RangeError, 'The maze can not be smaller than 2x2.');
  });
  it('should be able to iterate over it´s grid', function(){
    var grid  = new Grid(3, 4);
    var times = 0;
    grid.iterate(() => times++);
    assert.equal(times, 12);
  });
  it('should be able to convert 2D-coordinates (x, y) to 1D-coordinates (index)', function(){
    var grid = new Grid(3, 4);
    assert.equal(grid.getIndex(1, 2), 7);
  });
  it('should be able to convert 1D-coordinates (index) to 2D-coordinates (x, y)', function(){
    var grid = new Grid(4, 5);
    var pos  = grid.getCoordinate(6);
    assert.equal(pos.x, 2);
    assert.equal(pos.y, 1);
  });
  it('should be able to distinguish if a given index is in it´s grid or not', function(){
    var grid = new Grid(3, 3);
    assert.equal(grid.isInGrid(-1), false);
    assert.equal(grid.isInGrid(0), true);
    assert.equal(grid.isInGrid(8), true);
    assert.equal(grid.isInGrid(9), false);
  });
  it('should return cells relative to another cell (or false if out of grid)', function(){
    var grid = new Grid(3, 3);
    grid.iterate((x, y) => {
      grid.grid[grid.getIndex(x, y)] = x+'-'+y;
    });
    assert.equal(grid.grid[0], '0-0');
    assert.equal(grid.grid[8], '2-2');
    assert.equal(grid.getRelative(2, 2, -2, -2), '0-0');
    assert.equal(grid.getRelative(2, 2, -3, -3), false);
  });
  it('should be able to check if two objects are colliding (with AABB)', function(){
    var grid = new Grid(3, 3);
    var obj1 = {'x': 0,  'y': 4, 'width': 7, 'height': 4};
    var obj2 = {'x': 6,  'y': 7, 'width': 5, 'height': 5};
    var obj3 = {'x': 10, 'y': 7, 'width': 5, 'height': 5};
    assert.equal(grid.isColliding(obj1, obj2), true);
    assert.equal(grid.isColliding(obj1, obj3), false);
  });
  it('should be able to resolve collisions', function(){
    var grid = new Grid(3, 3);
    var obj1 = {'x': 0,  'y': 4, 'width': 7, 'height': 4};
    var obj2 = {'x': 6,  'y': 7, 'width': 5, 'height': 5};
    var obj3 = {'x': 4,  'y': 3, 'width': 4, 'height': 2};
    assert.equal(grid.isColliding(obj1, obj2), true);
    grid.resolveCollision(obj1, obj2);
    assert.equal(obj2.x, 6);
    assert.equal(obj2.y, 8); // only this part should change since x = y = 1 and y gets priorized over x
    assert.equal(grid.isColliding(obj1, obj2), false);

    assert.equal(grid.isColliding(obj1, obj3), true);
    grid.resolveCollision(obj1, obj3);
    assert.equal(obj3.x, 4);
    assert.equal(obj3.y, 2); // only this part should change since x = y = 1 and y gets priorized over x
    assert.equal(grid.isColliding(obj1, obj3), false);
  });
  it('should be able to get the shortest path to resolve a collision', function(){
    var grid = new Grid(3, 3);
    var obj1 = {'x': 0,  'y': 4, 'width': 7, 'height': 4};
    var obj2 = {'x': 6,  'y': 7, 'width': 5, 'height': 5};
    var obj3 = {'x': 4,  'y': 3, 'width': 4, 'height': 2};
    var v1 = grid.getSmallestTranslationVector(obj1, obj2);
    assert.equal(v1.x, 0);
    assert.equal(v1.y, 1);
    var v1 = grid.getSmallestTranslationVector(obj1, obj3);
    assert.equal(v1.x, 0);
    assert.equal(v1.y, -1);
  });
  it('should be able to calculate the minkowski difference of two objects', function(){
    var grid = new Grid(3, 3);
    var obj1 = {'x': 0,  'y': 4, 'width': 7, 'height': 4};
    var obj2 = {'x': 6,  'y': 7, 'width': 5, 'height': 5};
    var obj3 = {'x': 4,  'y': 3, 'width': 4, 'height': 2};
    var v1 = grid.getMinkowskiDifference(obj1, obj2);
    assert.equal(v1.x, 1);
    assert.equal(v1.y, 1);
    var v2 = grid.getMinkowskiDifference(obj1, obj3);
    assert.equal(v2.x, 3);
    assert.equal(v2.y, -1);
  });
});
