var gen = require('random-seed');
var Cell = require('./cell.js');


/**
 * Generates random levels by using a seed.
 * @example
 * // This will generate a new maze.
 * var level = new Level('seed', 10, 10);
 */
class Level{

  /**
   * Constructs this class and initializes the maze-generation.
   * @param  {string} seed   the seed for this map
   * @param  {int}    width  the number of columns in the maze
   * @param  {int}    height the number of rows in the maze
   * @param  {int}    scale  the width/height of one cell
   */
  constructor(seed, width, height, scale){
    console.log('level is generating');
    if(width < 2 || height < 2){
      throw new RangeError('The maze can not be smaller than 2x2.');
    }
    this.r = new gen(seed);
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.grid = [];
    this.isGenerating = false;
    this.isGenerated = false;
    this.generate();
    console.log('level is generated');
  }

  draw(p){
    if(!this.isGenerated){
      console.log('level is not ready yet.');
    }
    var pos = false;
    for(var i = 0;i < this.width * this.height;i++){
      pos = this.getCoordinate(i);
      //p.stroke(255);
      this.grid[i].draw(p, pos.x * this.scale, pos.y * this.scale, this.scale, this.scale);
    }
  }

  /**
   * Generates the maze
   */
  generate(){
    this.meta = [];
    this.stack = [];
    this.isGenerating = true;
    // initialize the arrays
    for(var i = 0;i < this.width;i++){
      for(var j = 0;j < this.height;j++){
        var cell = new Cell();
        this.grid.push(cell);
        this.meta.push({visited: false});
      }
    }
    // generating the maze
    var current = 0;
    var next = false;
    var generating = true;
    while(generating){
      this.meta[current].visited = true;
      //var next = this.meta[current].checkNeigbors();
      next = this.getNext(current);
      if(next){
        this.meta[next].visited = true;
        this.stack.push(current);
        //this.grid[current].setWalls([false, false, false, false]);
        this.removeWalls(current, next);
        current = next;
      } else if(this.stack.length > 0){
        current = this.stack.pop();
      } else {
        generating = false;
      }
    }
    console.log(this.grid);
    delete this.meta;
    delete this.stack;
    this.isGenerating = false;
    this.isGenerated = true;
  }

  /**
   * Checks if the neighbors of the cell with the index i have been visited or not.
   * Can only be called while the maze is generated.
   * @param  {int}   index the index of the current cell.
   * @return {array}    an array with 4 values, each for a side. The value is false if visited or contains the index of the cell.
   */
  checkNeighbors(index){
    if(!this.isGenerating){
      throw new ReferenceError('This function can only be called while the maze is generated.');
    }
    var pos = this.getCoordinate(index);
    var side = [false, false, false, false];
    var i = 0;
    // check the top neighbor
    if((i = this.getIndex(pos.x, pos.y - 1)) !== false){
      if(!this.meta[i].visited){
        side[0] = i;
      }
    }
    // check the right neighbor
    if((i = this.getIndex(pos.x + 1, pos.y)) !== false){
      if(!this.meta[i].visited){
        side[1] = i;
      }
    }
    // check the bottom neighbor
    if((i = this.getIndex(pos.x, pos.y + 1)) !== false){
      if(!this.meta[i].visited){
        side[2] = i;
      }
    }
    // check the left neighbor
    if((i = this.getIndex(pos.x - 1, pos.y)) !== false){
      if(!this.meta[i].visited){
        side[3] = i;
      }
    }
    return side;
  }

  /**
   * Picks a random unvisited neighbor.
   * Can only be called while the maze is generated.
   * @param  {int} index the index of the current cell.
   * @return {int}       the index of the picked cell or false if all neighbors are already visited.
   */
  getNext(index){
    if(!this.isGenerating){
      throw new ReferenceError('This function can only be called while the maze is generated.');
    }
    var n = this.checkNeighbors(index);
    var notVisited = [];
    for(var i = 0; i < n.length;i++){
      if(n[i] !== false){
        notVisited.push(n[i]);
      }
    }
    if(notVisited.length > 0){
      return notVisited[this.r(notVisited.length)];
    }
    return false;
  }

  /**
   * Removes the walls from two cells at their contact side.
   * @example
   * var level = new Level('seed', 10, 10);
   * console.log(level.removeWalls(0, 1));
   * @param  {int}  a the index of the first cell
   * @param  {int}  b the index of the second cell
   * @return {bool}   true: walls are removed, false: an error occurred
   */
  removeWalls(a, b){
    if(!this.isInMaze(a) || !this.isInMaze(b)){
      return false;
    }
    switch(b - a){
      case -this.width:                 // b is above a
        this.grid[a].setWall(0, false); // the top wall from a is removed
        this.grid[b].setWall(2, false); // the bottom wall from b is removed
        break;
      case 1:                           // b is right to a
        this.grid[a].setWall(1, false); // the right wall from a is removed
        this.grid[b].setWall(3, false); // the left wall from b is removed
        break;
      case this.width:                  // b is under a
        this.grid[a].setWall(2, false); // the bottom wall from a is removed
        this.grid[b].setWall(0, false); // the top wall from b is removed
        break;
      case -1:                          // b is left to a
        this.grid[a].setWall(3, false); // the left wall from a is removed
        this.grid[b].setWall(1, false); // the right wall from b is removed
        break;
      default:          // a and b are not neighbors and therefore have no contacting walls
        return false;
    }
    return true;
  }

  /**
   * Returns the index of 2D-coordinates in a 1D-array.
   * @example
   * // Presupposes that the maze has a size of 10x10.
   * // returns 32
   * var level = new Level('seed', 10, 10);
   * console.log(level.getIndex(2, 3));
   * @param  {int} x the x-coordinate in the 2D-array
   * @param  {int} y the y-coordinate in the 2D-array
   * @return {int}   the resulting index in a 1D-array
   */
  getIndex(x, y){
    if(x < 0 || y < 0 || x >= this.width || y >= this.height){
      return false;
    }
    return x + y*this.width;
  }

  /**
   * Returns the 2D-coordinates from a 1D-index.
   * @example
   * // Presupposes that the maze has a size of 10x10
   * // returns {x: 2, y: 3}
   * var level = new Level('seed', 10, 10);
   * console.log(level.getCoordinate(32));
   * @param  {int}    index the 1D-index
   * @return {object}       an object containing a x- and a y-value or false, if the given index is not part of the current maze.
   */
  getCoordinate(index){
    if(!this.isInMaze(index)){
      return false;
    }
    return {x: index % this.width, y: Math.floor(index / this.width)};
  }

  /**
   * Checks if the given index is part of the maze.
   * @example
   * var level = new Level('seed', 10, 10);
   * // will return true:
   * console.log(level.isInMaze(99));
   * // will return false:
   * console.log(level.isInMaze(100));
   * @param  {int}  index the given index
   * @return {bool}       true: the cell is in the maze, false: the cell is not part of the maze
   */
  isInMaze(index){
    if(index < 0 || index >= this.width*this.height){
      return false;
    }
    return true;
  }

}

module.exports = Level