import { Dictionary } from 'typescript-collections';
import { Player } from "./players";
import { PrisonersDilemmaMoves } from "./games";

export interface Strategy {
  play(opponent: Player): number;
  retroUpdate(opponent: Player, move: number): void;
  getName(): string;
}

export class TitForTat implements Strategy {
  hist: Dictionary<Player, number>;

  constructor() {
    this.hist = new Dictionary<Player, number>();
  }

  play(opponent: Player): number {
    if (this.hist.containsKey(opponent)) {
      return this.hist.getValue(opponent);
    } else {
      return PrisonersDilemmaMoves.COOPERATE;
    }
  }

  retroUpdate(opponent: Player, move: number): void {
    this.hist.setValue(opponent, move);
  }

  getName(): string {
    return name;
  }

}

export class AllDefect implements Strategy {
  play(opponent: Player): number {
    return PrisonersDilemmaMoves.DEFECT;
  }

  retroUpdate(opponent: Player, move: number): void { }

  getName(): string {
    return name;
  }
}
