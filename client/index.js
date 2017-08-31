require('./style/main.scss');
import Game from './game.js';



// this is the real game object
// it´s currently in the debug mode which will add it´s store globally as 'window.s' (nice for cheating :P )
var game = new Game(document.getElementById('app'), true);