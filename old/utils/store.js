import {observable} from 'mobx';

export default class Store {

  game = null;
  @observable el = null;
  @observable level = null;
  @observable width = 800;
  @observable height = 500;
  @observable debug = false;
  @observable state = 'level';

  constructor(){}

}