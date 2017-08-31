/**
 * This class handles the keyboard.<br>
 * It´s adding events to the games canvas and saves the current key-states which are then used in the game-loop.<br>
 * Due to the {@link https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9021586/|bug #9021586} the game may not be playable on Microsoft Edge on computers with low performance.
 */
class Keyboard {

  keyCode = {
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'esc': 27,
    'space': 32,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    'num0': 96,
    'num1': 97,
    'num2': 98,
    'num3': 99,
    'num4': 100,
    'num5': 101,
    'num6': 102,
    'num7': 103,
    'num8': 104,
    'num9': 105
  }

  isKeyDown = [];
  keyDown  = [];
  keyPress = [];
  keyUp    = [];

  /**
   * @param  {object} store The game´s store
   */
  constructor(store){
    this.store = store;
    for(var i = 0;i < 255;i++){
      this.isKeyDown[i] = false;
      this.keyDown[i]   = [];
      this.keyPress[i]  = [];
      this.keyUp[i]     = [];
    }
    this.context = this.store.context;
    var node = this.store.game.view;
    node.setAttribute('tabindex', 1);
    node.addEventListener('click', (e) => {
      if(node !== document.activeElement){
        node.focus();
      }
    }, false);
    node.addEventListener('keydown', (e) => {
      this.context = this.store.context;
      this.isKeyDown[e.keyCode] = true;
      e.preventDefault();
      for(var i = 0;i < this.keyDown[e.keyCode].length;i++){
        this.keyDown[e.keyCode][i](e);
      }
    }, false);
    node.addEventListener('keyup', (e) => {
      this.context = this.store.context;
      this.isKeyDown[e.keyCode] = false;
      e.preventDefault();
      for(var i = 0;i < this.keyUp[e.keyCode].length;i++){
        this.keyUp[e.keyCode][i](e);
      }
    }, false);
  }

  /**
   * Is executed by the game-loop and will execute every function bound to an already pressed key, e.g. WASD.
   */
  update(){
    this.context = this.store.context;
    for(var key = 0;key < this.keyPress.length;key++){
      if(this.isKeyDown[key]){
        for(var i = 0;i < this.keyPress[key].length;i++){
          this.keyPress[key][i]();
        }
      }
    }
  }

  /**
   * This function will execute functions which are bound to the pressing of a key.
   * @param {object}   context the context (game state) in which the function should be executed
   * @param {string}   key     the key which should trigger the function
   * @param {function} f       the function which should be executed
   */
  addKeyDown(context, key, f){
    if(typeof key == 'string'){
      key = this.keyCode[key];
    }
    this.keyDown[key].push((e) => {
      if(this.context == context){
        f(e);
      }
    });
  }

  /**
   * This function will be called by the game-loop if the key is pressed.
   * @param {object}   context the context (game state) in which the function should be executed
   * @param {string}   key     the key which should trigger the function
   * @param {function} f       the function which should be executed
   */
  addKeyPress(context, key, f){
    if(typeof key == 'string'){
      key = this.keyCode[key];
    }
    this.keyPress[key].push(() => {
      if(this.context == context){
        f();
      }
    });
  }

  /**
   * This function will execute functions which are bound to the releasing of a key.
   * @param {object}   context the context (game state) in which the function should be executed
   * @param {string}   key     the key which should trigger the function
   * @param {function} f       the function which should be executed
   */
  addKeyUp(context, key, f){
    if(typeof key == 'string'){
      key = this.keyCode[key];
    }
    this.keyUp[key].push((e) => {
      if(this.context == context){
        f(e);
      }
    });
  }

}

export default Keyboard;