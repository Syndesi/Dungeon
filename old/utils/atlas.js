var PIXI = require('pixi.js');

/**
 * A helper class for texture-management.
 * @see  {@link https://github.com/kittykatattack/learningPixi#loadingatlas| More detailed informations about texture atlases}
 * @example
 * var atlas = new Atlas();
 * // will return a PIXI.Texture
 * var texture = atlas.getTexture('atlas', 'tile-2-4');
 */
class Atlas {

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

module.exports = Atlas