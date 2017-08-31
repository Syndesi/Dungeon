import * as PIXI from 'pixi.js';
import Entity from '../primitives/entity.js';

/**
 * {@link https://en.wikipedia.org/wiki/Finn_the_Human|Finn the human} at another quest :P<br>
 * Even though I created his assets by myself I don´t have any permission to use him in my game, mostly because I created him on the last day before delivering this project.<br>
 * But I´m already waiting for a response from {@link http://www.cartoonnetwork.com|Cartoon Network}.
 * @extends entity
 */
class Finn extends Entity {

  /**
   * Creates a new Finn!
   * @param {object} store the game´s store
   */
  constructor(store){
    super(store, 'jumpingLeft');
    this.sprite.width = 16 * 3;
    this.sprite.height = 16 * 2 * 3;
    this.sprite.texture = this.store.lib.getTexture('tilemap', 'finn-right');
  }

  /**
   * Will be run by the game-loop to updates his position, animation etc.
   * @param  {float} delta the time since the last frame
   */
  update(delta){
    this.data.frame += delta * 0.15;
    switch(this.data.state){
      case 'idleRight':
        this.stateIdleRight();
        break;
      case 'idleLeft':
        this.stateIdleLeft();
        break;
      case 'walkingRight':
        this.stateWalkingRight();
        break;
      case 'walkingLeft':
        this.stateWalkingLeft();
        break;
      case 'jumpingRight':
        this.stateJumpingRight();
        break;
      case 'jumpingLeft':
        this.stateJumpingLeft();
        break;
      default:
        console.log('no valid state given');
        break;
    }
  }

  /**
   * Animation for just standing.
   */
  stateIdleRight(){
    this.sprite.texture = this.store.lib.getTexture('tilemap', 'finn-right');
  }

  /**
   * Animation for just standing.
   */
  stateIdleLeft(){
    this.sprite.texture = this.store.lib.getTexture('tilemap', 'finn-left');
  }

  /**
   * Animation for walking to the right side.
   */
  stateWalkingRight(){
    var frame = Math.floor(this.data.frame%4);
    if(frame >= 4){
      frame = 0;
      this.data.frame -= 4;
    }
    this.sprite.texture = this.store.lib.getTexture('tilemap', 'finn-walking-right-'+Math.floor(this.data.frame%4));
  }

  /**
   * Animation for walking to the left side.
   */
  stateWalkingLeft(){
    var frame = Math.floor(this.data.frame%4);
    if(frame >= 4){
      frame = 0;
      this.data.frame -= 4;
    }
    this.sprite.texture = this.store.lib.getTexture('tilemap', 'finn-walking-left-'+Math.floor(this.data.frame%4));
  }

  /**
   * Animation for jumping.
   */
  stateJumpingRight(){
    var frame = Math.floor(this.data.frame%8);
    if(frame >= 8){
      frame = 0;
      this.data.frame -= 8;
    }
    this.sprite.texture = this.store.lib.getTexture('tilemap', 'finn-jumping-right-'+Math.floor(this.data.frame%8));
  }

  /**
   * Animation for jumping.
   */
  stateJumpingLeft(){
    var frame = Math.floor(this.data.frame%8);
    if(frame >= 8){
      frame = 0;
      this.data.frame -= 8;
    }
    this.sprite.texture = this.store.lib.getTexture('tilemap', 'finn-jumping-left-'+Math.floor(this.data.frame%8));
  }

}

export default Finn;