var PIXI = require('pixi.js');
var v = require('victor');


/**
 * Creates a 2D-grid to organize objects so that special operations (e.g. collisions between them) are way faster to calculate (up to 1000 times, due to it´s quadratic nature).<br>
 * It will normally generate only up to 10 levels and - idealy - only save 10 objects per level.<br>
 * @see {@link https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374| Steve Lambert´s Quadtrees tutorial}
 * @see {@link https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection| Mozilla´s 2D collision detection}
 * @example
 * var tree = new Quadtree(0, 0, 100, 100);
 * var obj1 = {'x': 0, 'y':0, 'width':10, 'height':10};
 * var obj2 = {'x':10, 'y':0, 'width':10, 'height':10};
 * var obj3 = {'x': 5, 'y':0, 'width':10, 'height':10};
 * tree.insert(obj1);
 * tree.insert(obj2);
 * // will return obj1 and not obj2
 * console.log(tree.getCollisions(obj3));
 */
class Quadtree {

  /**
   * Creates a new Quadtree.
   * @param  {int} x      the x-coordinate of the top-left corner
   * @param  {int} y      the y-coordinate of the top-left corner
   * @param  {int} width  the width of the quadtree (e.g. the width of the level)
   * @param  {int} height the height of the quadtree (e.g. the height of the level)
   * @param  {int} level  should be 0 when using this function "manually"
   */
  constructor(x, y, width, height, level = 0){
    this.data = {
      'maxLevels':  10,
      'maxEntitys': 10,
      'x': x,
      'y': y,
      'width': width,
      'height': height,
      'level': level
    };
    this.childs = [];
    this.nodes = false;
  }

  /**
   * Splits the current node into 4 smaller nodes.
   */
  split(){
    var level = this.data.level + 1;
    var w = this.data.width / 2;
    var h = this.data.height / 2;
    var x = this.data.x;
    var y = this.data.y;
    this.nodes = [];
    this.nodes[0] = new Quadtree(    x,     y, w, h, level);
    this.nodes[1] = new Quadtree(    x, y + h, w, h, level);
    this.nodes[2] = new Quadtree(x + w, y + h, w, h, level);
    this.nodes[3] = new Quadtree(x + w,     y, w, h, level);
  }

  /**
   * Returns if the object can fit into one of the corners (0-3) or only in the whole area.
   * @param  {int} x      the x-coordinate of the top-left corner of the object
   * @param  {int} y      the y-coordinate of the top-left-corner of the object
   * @param  {int} width  the width of the object
   * @param  {int} height the height of the object
   * @return {int}        -1: fits only in the hole are, 0: top-left, 1: bottom-left, 2: bottom-right, 3: top-right corner
   */
  getIndex(x, y, width, height){
    var middleX = this.data.x + this.data.width / 2;
    var middleY = this.data.y + this.data.height / 2;
    if(this.data.y <= y && y + height <= middleY){ // can fit in the upper half
      if(this.data.x <= x && x + width <= middleX){
        return 0; // top left tile
      }
      if(middleX <= x && x + width <= this.data.x + this.data.width){
        return 3; // top right tile
      }
    }
    if(middleY <= y && y + height <= this.data.y + this.data.height){ // can fit in the lower half
      if(this.data.x <= x && x + width <= middleX){
        return 1; // bottom left tile
      }
      if(middleX <= x && x + width <= this.data.x + this.data.width){
        return 2; // bottom right tile
      }
    }
    return -1; // object can't fit into only one tile -> remains in the current tile
  }

  /**
   * Inserts an object into the quadtree and spliting it into subnodes if necessary.
   * @param  {object} obj an object with x-, y-, width- and height-parameters (e.g. PIXI.Sprite, PIXI.Container, ...)
   */
  insert(obj){
    if(this.nodes){
      var index = this.getIndex(obj.x, obj.y, obj.width, obj.height);
      if(index != -1){
        this.nodes[index].insert(obj);
      } else {
        this.childs.push(obj);
      }
    } else {
      this.childs.push(obj);
      // spliting the current node into 4 subnodes and sorting the current children into them
      if(this.childs.length >= this.data.maxEntitys && this.data.level < this.data.maxLevels){
        this.split();
        var i = 0;
        var length = this.childs.length;
        while(i < length){
          obj = this.childs[i];
          var index = this.getIndex(this.childs[i].x, this.childs[i].y, this.childs[i].width, this.childs[i].height);
          if(index != -1){
            this.nodes[index].insert(this.childs.splice(i, 1)[0]);
          } else {
            i++;
          }
          length = this.childs.length;
        }
      }
    }
  }

  /**
   * Returns all objects which could collide with the given object.
   * @param  {object} obj an object with x-, y-, width- and height-parameters (e.g. PIXI.Sprite, PIXI.Container, ...)
   * @param  {Array}  res should be empty when starting this function "manually"
   * @return {Array}      an array with all objects which could collide with the given object
   */
  retrieve(obj, res = []){
    var index = this.getIndex(obj.x, obj.y, obj.width, obj.height);
    if(index != -1 && this.nodes){
      res = res.concat(this.nodes[index].retrieve(obj));
    }
    res = res.concat(this.childs);
    return res;
  }

  /**
   * Returns all actual collisions between the given object and the objects in the quadtree.
   * @param  {object} obj an object with x-, y-, width- and height-parameters (e.g. PIXI.Sprite, PIXI.Container, ...)
   * @return {Array}      an array with objects who are colliding with the given object
   */
  getCollisions(obj){
    var possibleCollisions = this.retrieve(obj);
    var collisions = [];
    for(var i = 0;i < possibleCollisions.length;i++){
      if(this.areColliding(obj, possibleCollisions[i])){
        collisions.push(possibleCollisions[i]);
      }
    }
    return collisions;
  }

  /**
   * Checks if the two given objects are colliding with each other or not.
   * @param  {object} obj1 the first object
   * @param  {object} obj2 the second object
   * @return {bool}        true: given objects are overlapping, false: no collision
   */
  areColliding(obj1, obj2){
    if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.height + obj1.y > obj2.y){
      return true;
    }
    return false;
  }

}

module.exports = Quadtree