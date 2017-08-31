import * as PIXI from 'pixi.js';
import randomSeed from 'random-seed';
import Grid from './grid.js';
import Room from './room.js';
import Finn from '../objects/finn.js';

/**
 * Generates random levels by using a seed.<br>
 * The algorithm *recursive backtracker* is covered by {@link https://youtu.be/HyK_Q5rrcr4|The Coding Trains coding challenge} and is explained on {@link https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker|Wikipedia}.
 * @extends Grid
 */
class Level extends Grid{

  /**
   * Constructs this class and initializes the maze-generation.
   * @param  {string} seed   the seed for this map
   * @param  {int}    width  the number of columns in the maze
   * @param  {int}    height the number of rows in the maze
   */
  constructor(store, seed, width = 10, height = 10){
    super(width, height);
    this.store = store;
    this.r     = new randomSeed(seed);
    this.room  = {
      'height': 6 * this.store.scale * 16,
      'width': 6 * this.store.scale * 16
    };
    this.rooms = [];
    this.level = new PIXI.Container();
    this.generate();
    this.finn = new Finn(this.store);
    this.finn.x = 2 * 16 * this.store.scale;
    this.finn.y = 4 * 16 * this.store.scale;
    this.level.addChild(this.finn);
  }

  update(delta){
    for(var i = 0;i < this.rooms.length;i++){
      this.rooms[i].update(delta);
    }
  }

  /**
   * Moves the level upwards
   */
  moveUp(){
    this.move(0, 4);
  }

  /**
   * Moves the level to the right
   */
  moveRight(){
    this.move(-4, 0);
  }

  /**
   * Moves the level downwards
   */
  moveDown(){
    this.move(0, -4);
  }

  /**
   * Moves the level to the left
   */
  moveLeft(){
    this.move(4, 0);
  }

  move(x, y){
    this.level.x += x;
    this.level.y += y;
    if(0 < this.level.x){
      this.level.x = 0;
    }
    if(0 < this.level.y){
      this.level.y = 0;
    }
    var minX = -(this.room.width * this.width) + this.store.game.screen.width;
    var minY = -(this.room.height * this.height) + this.store.game.screen.height;
    if(this.level.x <  minX){
      this.level.x = minX;
    }
    if(this.level.y <  minY){
      this.level.y = minY;
    }
    this.recalculateScreen();
  }

  /**
   * Calculates which rooms should be visible and which not.<br>
   * It´s a huge performance increase and until the level contains several hundred rooms the for-loop won´t be an issue.
   */
  recalculateScreen(){
    var x = -this.level.x;
    var y = -this.level.y;
    var width = this.store.game.screen.width;
    var height = this.store.game.screen.height;

    var top = Math.floor(y / this.room.height);
    var right = Math.ceil((x + width - this.room.width) / this.room.width);
    var bottom = Math.ceil((y + height - this.room.height) / this.room.height);
    var left = Math.floor(x / this.room.width);
    //console.log('x: '+this.level.x+', y: '+this.level.y+', width: '+this.store.game.screen.width+', height: '+this.store.game.screen.height);
    //console.log('top: '+top+', right: '+right+', bottom: '+bottom+', left: '+left);
    this.iterate((x, y) => {
      var room = this.rooms[this.getIndex(x, y)].room;
      if(left <= x && x <= right && top <= y && y <= bottom){
        if(!room.visible){
          room.visible = true;
        }
      } else if(room.visible){
        room.visible = false;
      }
    });
  }  

  /**
   * Generates the maze
   */
  generate(){
    var stack   = [];
    var visited = [];
    var ends = [];
    var returning = false;
    var current = 0;
    var next    = false;
    this.iterate((x, y) => {
      this.grid[this.getIndex(x, y)] = {
        'wall': {
          'top': true,
          'right': true,
          'bottom': true,
          'left': true
        },
        'visited': false
      };
    });
    var generating = true;
    while(generating){
      this.grid[current].visited = true;
      next = this.getNext(current);
      if(next){
        stack.push(current);
        this.removeWalls(current, next);
        current = next;
        returning = false;
      } else if(stack.length > 0){
        if(!returning){
          ends.push(current);
        }
        returning = true;
        current = stack.pop();
      } else {
        generating = false;
      }
    }
    this.iterate((x, y) => {
      delete this.grid[this.getIndex(x, y)].visited;
    });
    this.iterate((x, y) => {
      var index    = this.getIndex(x, y);
      var cell     = this.grid[index];
      var chest = false;
      if(ends.includes(index)){
        chest = true;
      }
      this.rooms[index] = new Room(this.store, cell.wall, this.r.random(), chest);
      this.rooms[index].room.x = this.room.width * x;
      this.rooms[index].room.y = this.room.height * y;
      this.level.addChild(this.rooms[index].room);
    });
  }

  /**
   * Checks if the neighbors of the cell with the index i have been visited or not.
   * @param  {int}   index the index of the current cell.
   * @return {array} an array with 4 values, each for a side. The value is false if visited or contains the index of the cell.
   */
  checkNeighbors(index){
    var pos  = this.getCoordinate(index);
    var side = [false, false, false, false];
    var i    = false;
    // check the top neighbor
    if((i = this.getIndex(pos.x, pos.y - 1)) !== false){
      if(!this.grid[i].visited){
        side[0] = i;
      }
    }
    // check the right neighbor
    if((i = this.getIndex(pos.x + 1, pos.y)) !== false){
      if(!this.grid[i].visited){
        side[1] = i;
      }
    }
    // check the bottom neighbor
    if((i = this.getIndex(pos.x, pos.y + 1)) !== false){
      if(!this.grid[i].visited){
        side[2] = i;
      }
    }
    // check the left neighbor
    if((i = this.getIndex(pos.x - 1, pos.y)) !== false){
      if(!this.grid[i].visited){
        side[3] = i;
      }
    }
    return side;
  }

  /**
   * Picks a random unvisited neighbor.
   * @param  {int} index the index of the current cell.
   * @return {int}       the index of the picked cell or false if all neighbors are already visited.
   */
  getNext(index){
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
   * @param  {int}  a the index of the first cell
   * @param  {int}  b the index of the second cell
   * @return {bool}   true: walls are removed, false: an error occurred
   */
  removeWalls(a, b){
    if(!this.isInGrid(a) || !this.isInGrid(b)){
      return false;
    }
    switch(b - a){
      case -this.width:                   // b is above a
        this.grid[a].wall.top    = false; // the top wall from a is removed
        this.grid[b].wall.bottom = false; // the bottom wall from b is removed
        break;
      case 1:                             // b is right to a
        this.grid[a].wall.right  = false; // the right wall from a is removed
        this.grid[b].wall.left   = false; // the left wall from b is removed
        break;
      case this.width:                    // b is under a
        this.grid[a].wall.bottom = false; // the bottom wall from a is removed
        this.grid[b].wall.top    = false; // the top wall from b is removed
        break;
      case -1:                            // b is left to a
        this.grid[a].wall.left   = false; // the left wall from a is removed
        this.grid[b].wall.right  = false; // the right wall from b is removed
        break;
      default: // a and b are not neighbors and therefore have no contacting walls
        return false;
    }
    return true;
  }

}

export default Level;