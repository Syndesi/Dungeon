class Cell{
  constructor(){
    this.walls = [true, true, true, true];
  }

  getWalls(){
    return this.walls;
  }

  setWalls(walls){
    this.walls = walls;
  }

  setWall(side, status){
    this.walls[side] = status;
  }

  draw(p, x, y, width, height){
    if(this.walls[0]){
      //p.line(x, y, x+width, y);
    }
    if(this.walls[1]){
      //p.line(x+width, y, x+width, y+height);
    }
    if(this.walls[2]){
      //p.line(x, y+height, x+width, y+height);
    }
    if(this.walls[3]){
      //p.line(x, y+height, x, y);
    }
  }
}

module.exports = Cell