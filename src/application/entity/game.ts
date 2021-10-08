import { Field } from "./field";
import { Player } from "./player";
import { Npc } from "./npc";

export class Game {
  public battleField: Field;
  public listOfPlayer: Player[];
  public tagger: Npc;
  constructor(battleField: Field, listOfPlayer: Player[],tagger: Npc) {
    this.battleField = battleField;
    this.listOfPlayer = listOfPlayer;
    this.tagger = tagger;
  }
}