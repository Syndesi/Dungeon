import {assert} from 'chai';
import * as PIXI from 'pixi.js';

import Store from '../client/store.js';
import Inventory from '../client/util/inventory.js';
import Text from '../client/primitives/text.js';
import Tooltip from '../client/primitives/tooltip.js';
import ProgressBar from '../client/primitives/progressBar.js';

describe('Inventory extends PIXI.Container', function(){
  it('should initialize correctly', function(){
    var store = new Store();
    var inv  = new Inventory(store);
    assert.instanceOf(inv.store, Store);
    assert.equal(inv.data.offset.x, 12);
    assert.equal(inv.data.offset.y, 0);
    assert.instanceOf(inv.health, ProgressBar);
    assert.equal(inv.health.interactive, true);
    assert.instanceOf(inv.healthTooltip, Tooltip);
    assert.instanceOf(inv.textCoins, Text);
  });
  it('should updates it´s position correctly', function(){
    var store = new Store();
    var inv  = new Inventory(store);
    inv.updatePos();
    assert.equal(inv.health.x, 10);
    assert.equal(inv.health.y, 10);
    assert.equal(inv.textCoins.x, 10);
    assert.equal(inv.textCoins.y, 15 + inv.health.height);
  });
  it('should updates correctly', function(){
    var store = new Store();
    var inv  = new Inventory(store);
    store.player.coins = 123456;
    store.player.health = 3;
    inv.update(1.23);
    assert.equal(inv.health.data.progress, 0.3);
    assert.equal(inv.textCoins.text, '<e>Coins: 123456</e>');
  });
});