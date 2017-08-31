import * as PIXI from 'pixi.js';

/**
 * The basic class for all entitys in the game.
 */
class Entity extends PIXI.Container {

  data = {
    'state': '',
    'states': {},
    'frame': 0
  };

  /**
   * @param  {object} store the game´s store
   * @param  {string} state the default state for this entity (= default animation)
   */
  constructor(store, state){
    super();
    this.store = store;
    this.data.state = state;
    this.data.states = [];
    this.sprite = new PIXI.Sprite(this.store.lib.getTexture('tilemap', 'finn-right'));
    this.addChild(this.sprite);
  }

  /**
   * Updates the entity so that e.g. animations and physics can work properly.
   * @param  {float} delta the time since the last frame
   */
  update(delta){
    this.data.frame += delta;
    if(this.data.states[this.data.state]){
      this.data.states[this.data.state]('delta');
      console.log('updated');
    }
  }

  /**
   * Sets the current state (=animation)
   * @param {string} state the new state
   */
  setState(state){
    this.data.state = state;
  }

}

export default Entity;