var PIXI = require('pixi.js');

class Lib {

  constructor(){
    this.scale = window.store.data.level.scale;
  }

  /**
   * Sets the position of an object in only one line.
   * @param {object} obj    the object which should be changed
   * @param {int} x         the x-coordinate
   * @param {int} y         the y-coordinate
   * @param {int} width     the width of the object
   * @param {int} height    the height of the object
   */
  setPos(obj, x, y, width, height){
    obj.x = x;
    obj.y = y;
    obj.width = width;
    obj.height = height;
  }

  /**
   * Returns a texture.
   * @param  {string}       atlas the name of the texture-atlas which should be used
   * @param  {string}          id the name of the actual texture, specified in it´s .json-file
   * @return {PIXI.Texture}       the loaded texture or an empty texture, if the former wasn't found
   */
  getTexture(atlas, id, debug = false){
    //console.log('atlas: '+atlas+', id: '+id);
    atlas = 'assets/textures/'+atlas+'.json';
    var msg = false;
    if(atlas in PIXI.loader.resources){
      if(id in PIXI.loader.resources[atlas].textures){
        return PIXI.loader.resources[atlas].textures[id];
      } else {
        msg = 'unknown id: '+id;
      }
    } else {
      msg = 'unknown atlas: '+atlas;
    }
    if(debug && msg){
      console.log(msg);
    }
    return PIXI.Texture.WHITE;
  }

  /**
   * Checks if a texture is already loaded or not.
   * @param  {string}  atlas the name of the texture-atlas which should be used
   * @param  {string}  id the name of the actual texture, specified in it´s .json-file
   * @return {Boolean} true: the texture is loaded, false: it does not exist
   */
  isTexture(atlas, id){
    atlas = 'assets/textures/'+atlas+'.json';
    if(atlas in PIXI.loader.resources){
      if(id in PIXI.loader.resources[atlas].textures){
        return true;
      }
    }
    return false;
  }

}

module.exports = Lib