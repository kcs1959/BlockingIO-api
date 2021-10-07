type PlayerStatus = "alive" | "dead";

import { User } from "./user"

const user = new User("username");

export class Player {
  public position: { x: number, y: number };
  public point: number;
  public uid: string;
  public username: string;
  public status: PlayerStatus;
  constructor() {
    this.position = { x: 0, y: 0 }
    this.point = 0;
    this.uid = user.uid;
    this.username = user.uid;
    this.status = "alive";
  }
}