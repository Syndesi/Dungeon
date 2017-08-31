class ThemeCobble extends PIXI.Container{

  getWall(r){
    if(r < 0.8){        // 80%
      return {'atlas': 'tilemap', 'id': 'cobble-fg-0'};
    } else if(r < 0.9){ // 10%
      return {'atlas': 'tilemap', 'id': 'cobble-fg-1'};
    } else{             // 10%
      return {'atlas': 'tilemap', 'id': 'cobble-fg-2'};
    }
  }

  getBackground(r){
    if(r < 0.8){        // 80%
      return {'atlas': 'tilemap', 'id': 'cobble-bg-0'};
    } else if(r < 0.9){ // 10%
      return {'atlas': 'tilemap', 'id': 'cobble-bg-1'};
    } else{             // 10%
      return {'atlas': 'tilemap', 'id': 'cobble-bg-2'};
    }
  }

  getFloorDecoration(r){
    if(r < 0.05){        // 5%
      return {'atlas': 'tilemap', 'id': 'skull-0'};
    } else if(r < 0.1){ // 5%
      return {'atlas': 'tilemap', 'id': 'skull-1'};
    } else if(r < 0.2){ // 10%
      return {'atlas': 'tilemap', 'id': 'alleymonster-0'};
    }
    return false;
  }

}

module.exports = ThemeCobble