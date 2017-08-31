# Dungeon game

This game is written for the german code-competition "[Der dynamische Dungeon 2017](https://www.it-talents.de/foerderung/code-competition/code-competition-08-2017)" by IT-Talents.<br>
The reason why I wanted to participate was that I destroyed my computers motherboard (long story short: If too much thermal compound is used, it can flow under the CPU and I broke a pin while cleaning the socket) and wanted to earn money to buy spare parts.<br>
And while developing I learned to write unit tests and how to document code so that special software, e.g. [JSDoc](http://usejsdoc.org/), can generate a cool looking website like this one. And this alone is actually a huge achievement for myself :D<br>
Btw.: I developed this game on my laptop, a [Lenovo 100S](http://www3.lenovo.com/de/de/laptops/ideapad/100-series-/IdeaPad-100S-11IBY/p/88EM10S0639) with an Intel Atom 32 bit and 2 GB of RAM. And I´m actually quiet impressed how well it performed, even though Firefox and ST3 crashed multiple times the day :P

## Installation

1. You will need to install [Yarn](https://yarnpkg.com/lang/en/) in order to build this game.
2. Download this repository and extract the files into an empty directory.
3. Open a Terminal/Shell in this directory and execute this command: ```yarn install```, it will download all dependencys.
4. The third step will most likely break due to the ```canvas```-module.<br>
   This module is only needed for testing this application, so feel free to uninstall it with ```yarn remove canvas``` and complete the installation with ```yarn install```.<br>
   But if you need to test the application, please follow [these instructions (general)](https://www.npmjs.com/package/canvas) or [this tutorial (for Windows)](https://github.com/Automattic/node-canvas/wiki/Installation---Windows), it covers every step.<br>
   Btw: I needed 10 hours to completely install this module... ^^
5. Once everything is installed, you can run these commands:
   ```sh
   yarn build # will build a standalone version which can deployed on webservers
   yarn doc   # will regenerate the documentation
   yarn start # will start the internal webpack server and the game is available under localhost:8080
   yarn test  # will run all available unit tests, but the canvas-modul is required
   ```
6. If you want to add things to this game, you might also consider installing [XAMPP](https://www.apachefriends.org/index.html) or any other PHP-parser because I have written some scripts which convert files into formats that can be understud by Pixi.js.

## Warning

Due to the [bug #9021586](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9021586/) the game may not be playable on Microsoft Edge on computers with low performance.

## Special thanks

While developing this game I asked several people/teams if I could use their assets, mainly because I'm not that good at creating pixel art :P<br>
And here are these heroes:
 - RadioactiveStud from the [DivineRPG](https://github.com/DivineRPG/DivineRPG) team, who created an awesome mod for Minecraft
 - Rhodox from the [Painerly Pack](http://painterlypack.net/), a resourcepack generation tool for Minecraft
Because the implementation (mainly drawing) of entitys took way longer than expected, I never implemented these cool assets :(

I also used these projects:
 - [Pixi.js](http://www.pixijs.com/), the render engine in this game
 - [FFF Forward](http://www.1001fonts.com/fff-forward-font.html), a pixel font