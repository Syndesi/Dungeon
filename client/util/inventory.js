import * as PIXI from 'pixi.js';

import Text from '../primitives/text.js';
import Tooltip from '../primitives/tooltip.js';
import ProgressBar from '../primitives/progressBar.js';

/**
 * This class handles the inventory, therefore the GUI while playing the game.
 */
class Inventory extends PIXI.Container{

  /**
   * Extends {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}.
   * @param  {object} store the game´s store
   */
  constructor(store){
    super();
    this.store = store;
    var s      = this.store;
    this.data  = {
      'offset': {
        'x': 12,
        'y': 0
      }
    };
    this.health = new ProgressBar(s, 50, 0, s.player.maxHealth, s.player.health, 'Red');
    this.healthTooltip = new Tooltip(s, '', 'Red');
    this.healthTooltip.visible = false;
    this.health.interactive = true;
    this.health
      // events for displaying the tooltip
      .on('mouseover', this.onHealthMouseOver, this)
      .on('mouseout', this.onHealthMouseOut, this)
      // events for drag move
      .on('mousemove', this.onHealthDragMove, this)
      .on('touchmove', this.onHealthDragMove, this);
    this.textCoins = new Text('Text');
    this.addChild(this.health);
    this.addChild(this.textCoins);
    this.addChild(this.healthTooltip);
    this.updatePos();
  }

  /**
   * Recalculates the position of all it´s components.
   */
  updatePos(){
    this.health.x = 10;
    this.health.y = 10;
    this.textCoins.x = 10;
    this.textCoins.y = 15 + this.health.height;
  }

  /**
   * Called by the game-loop to update its components.
   * @param  {float} delta the time since the last frame
   */
  update(delta){
    this.updatePos();
    this.health.update(delta, this.store.player.health);
    this.textCoins.text = '<e>Coins: '+this.store.player.coins+'</e>';
  }

  /**
   * Triggered when the mouse is "entering" the health-progressBar to enable its tooltip.
   * @param  {event} e the event emited by PIXI.js (no native event)
   */
  onHealthMouseOver(e){
    var pos = e.data.getLocalPosition(this.parent);
    this.healthTooltip.x = pos.x - this.x + this.data.offset.x;
    this.healthTooltip.y = pos.y - this.y + this.data.offset.y;
    this.healthTooltip.setText('<0>Health: '+s.player.health+'/'+s.player.maxHealth+'</0>');
    this.healthTooltip.visible = true;
  }

  /**
   * Triggered when the mouse is leaves the health-progressBar to disable its tooltip.
   * @param  {event} e the event emited by PIXI.js (no native event)
   */
  onHealthMouseOut(e){
    this.healthTooltip.visible = false;
  }

  /**
   * Triggered when the mouse is moved over the health-progressBar to updates its tooltip´s position.
   * @param  {event} e the event emited by PIXI.js (no native event)
   */
  onHealthDragMove(e){
    if(this.healthTooltip.visible){
      var pos = e.data.getLocalPosition(this.parent);
      this.healthTooltip.x = pos.x - this.x + this.data.offset.x;
      this.healthTooltip.y = pos.y - this.y + this.data.offset.y;
    }
  }

}

export default Inventory;