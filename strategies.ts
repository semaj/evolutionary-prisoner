import { Dictionary } from 'typescript-collections';
import { Player } from "./players";
import { PrisonersDilemmaMoves } from "./games";

export interface Strategy {
  play(opponent: Player): number;
  retroUpdate(opponent: Player, move: number): void;
  toString(): string;
  color(): number[];
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

  toString(): string {
    return "tit-for-tat";
  }

  color(): number[] {
    return [0, 0, 255];
  }

}

export class AllDefect implements Strategy {
  play(opponent: Player): number {
    return PrisonersDilemmaMoves.DEFECT;
  }

  retroUpdate(opponent: Player, move: number): void { }

  toString(): string {
    return "all-defect";
  }

  color(): number[] {
    return [255, 0, 20];
  }
}

export class AllCooperate implements Strategy {
  play(opponent: Player): number {
    return PrisonersDilemmaMoves.COOPERATE;
  }

  retroUpdate(opponent, move) {}

  toString() : string {
    return "all-cooperate";
  }

  color(): number[] {
    return [0, 255, 0];
  }
}
