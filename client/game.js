import * as PIXI from 'pixi.js';
import Store from './store.js';

/**
 * This is the main object of the dungeon game.
 */
class Game {

  /**
   * @param  {node} el    The DOM-node to which the game should be added
   * @param  {bool} debug true: the game will give more informations about itself, false: "production" mode (quieter)
   */
  constructor(el, debug = false){
    this.store = new Store(el);
    var s = this.store;
    if(debug){
      s.debug = true;
      window.s = s;
    }
    s.game = new PIXI.autoDetectRenderer(s.width, s.height, {
      antialias: false,
      transparent: false,
      resolution: 1
    });
    s.el.appendChild(s.game.view).className = 'pixi';
    s.stage = new PIXI.Container();
    s.game.render(s.stage);
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    s.loader = new PIXI.loaders.Loader();
    this.loadAssets();
  }

  /**
   * This function will load all necessary assets.<br>
   * Because this game needs very few files I didn´t implemented any automatic system (e.g. load all files recursively from the folder x/).<br>
   * And this function will trigger the main gameloop when all assets are loaded.
   */
  loadAssets(){
    var self = this;
    this.store.loader
      .add("assets/textures/gui.json")
      .add("assets/textures/tilemap.json")
      .load(function(){
        console.log('game loaded');
        self.store.init();
        PIXI.ticker.shared.add(self.store.update, self.store);
      }
    );
  }

}

export default Game;