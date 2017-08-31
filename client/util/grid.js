/**
 * A helper class with functions that are usefull in grids.<br>
 * Used by {@link Level} and {@link Room}.
 */
class Grid {

  /**
   * @param  {int} width  the columns in the grid
   * @param  {int} height the rows in the grid
   */
  constructor(width = 5, height = 5){
    if(width < 2 || height < 2){
      throw new RangeError('The maze can not be smaller than 2x2.');
    }
    this.width  = width;
    this.height = height;
    this.grid   = [];
  }

  /**
   * Iterates over every single element in this grid.
   * @param  {function} f the function which should be called
   */
  iterate(f){
    for(var y = 0;y < this.height;y++){
      for(var x = 0;x < this.width;x++){
        f(x, y);
      }
    }
  }

  /**
   * Returns the index of a 2D-coordinate in a 1D-system.
   * @param  {int} x the x-coordinate
   * @param  {int} y the y-coordinate
   * @return {int}   the resulting 1D-coordinate or false if it isn´t part of this grid
   */
  getIndex(x, y){
    if(x < 0 || y < 0 || x >= this.width || y >= this.height){
      return false;
    }
    return x + y*this.width;
  }

  /**
   * Returns the index of a 1D-coordinate in a 2D-system.
   * @param  {int} index the iD-coordinate/index
   * @return {int}       the resulting 2D-coordinate or false if it isn´t part of this grid.
   */
  getCoordinate(index){
    if(!this.isInGrid(index)){
      return false;
    }
    return {x: index % this.width, y: Math.floor(index / this.width)};
  }

  /**
   * checks if an 1D-coordinate is part of this grid or not.
   * @param  {int}  index the 1D-coordinate
   * @return {bool}       true: it´s part of this system, false: it´s not
   */
  isInGrid(index){
    if(index < 0 || index >= this.width * this.height){
      return false;
    }
    return true;
  }

  /**
   * Returns a cell relative to another cell - if it´s existing.
   * @param  {int}  x  the x-coordinate of the first cell
   * @param  {int}  y  the y-coordinate of the first cell
   * @param  {int}  dx the relative x-distance of both cells
   * @param  {int}  dy the relative y-distance of both cells
   * @return {cell}    returns the wanted cell or false if it isn´t part of this grid
   */
  getRelative(x, y, dx, dy){
    if(this.getIndex(x, y) !== false && this.getIndex(x + dx, y + dy) !== false){
      return this.grid[this.getIndex(x + dx, y + dy)];
    }
    return false;
  }

  /**
   * Check if two objects are colliding (=overlapping) or not, based on the AABB-method.
   * @param  {object} obj1 the first object
   * @param  {object} obj2 the second object
   * @return {bool}         true: the objects are overlapping, false: they are seperated or just touching each other
   */
  isColliding(obj1, obj2){
    if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.height + obj1.y > obj2.y){
      return true;
    }
    return false;
  }

  /**
   * Moves the second object just enough so that both objects aren´t colliding anymore.
   * @param  {object} obj1 the first object
   * @param  {object} obj2 the second object
   */
  resolveCollision(obj1, obj2){
    // obj1 is fixed, obj2 moveable
    var v = this.getSmallestTranslationVector(obj1, obj2);
    obj2.x += v.x;
    obj2.y += v.y;
  }

  /**
   * Calculates the Minkowski-difference between both objects, see {@link https://wildbunny.co.uk/blog/2011/12/14/how-to-make-a-2d-platform-game-part-2-collision-detection|Wildbunny´s tutorial}.
   * @param  {object} obj1 the first object
   * @param  {object} obj2 the second object
   * @return {vector}      the vector to move obj2 to the closest corner of obj1
   */
  getMinkowskiDifference(obj1, obj2){
    var sum = {
      'x': obj1.x - (obj2.width / 2),
      'y': obj1.y - (obj2.height / 2),
      'width': obj1.width + obj2.width,
      'height': obj1.height + obj2.height
    };
    var point = {
      'x': obj2.x + (obj2.width / 2),
      'y': obj2.y + (obj2.height / 2)
    };
    var r = {
      'x': point.x - sum.x,
      'y': point.y - sum.y
    };
    var res = {};
    var up = -r.y;
    var down = sum.height - r.y;
    var left = -r.x;
    var right = sum.width - r.x;
    if(up + down > 0){
      // point closer to the top edge
      res.y = up;
    } else {
      res.y = down;
    }
    if(left + right > 0){
      // point closer to the left edge
      res.x = left;
    } else {
      res.x = right;
    }
  }

  /**
   * Takes the Minkowski-difference and removes the longer part of the vector so that the translation is as small as possible.
   * @param  {object} obj1 the first object
   * @param  {object} obj2 the second object
   * @return {vector}      the shortened Minkowski-difference, e.g. (3, 4) => (3, 0)
   */
  getSmallestTranslationVector(obj1, obj2){
    var r = this.getMinkowskiDifference(obj1, obj2);
    if(Math.abs(r.x) < Math.abs(r.y)){
      // |x| < |y|
      r.y = 0;
    } else {
      // |y| < |x|
      r.x = 0;
    }
  }

}

export default Grid;