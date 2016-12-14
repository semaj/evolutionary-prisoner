import { Player } from "./players";

export interface Game {

  versus(one: Player, two: Player): [number, number];
}

export enum PrisonersDilemmaMoves {
  DEFECT,
  COOPERATE
}

export enum PrisonersDilemmaPayouts {
  MUTUAL_COOPERATION,
  MUTUAL_DEFECTION,
  DEFECTION,
  COOPERATION
}
export class PrisonersDilemma implements Game {

  versus(one: Player, two: Player): [number, number] {
    let playerOneMove: number = one.play(two);
    let playerTwoMove: number = two.play(one);
    one.retroUpdate(two, playerTwoMove);
    two.retroUpdate(one, playerOneMove);
    if (playerOneMove == PrisonersDilemmaMoves.DEFECT &&
        playerTwoMove == PrisonersDilemmaMoves.DEFECT) {
      return [PrisonersDilemmaPayouts.MUTUAL_DEFECTION,
               PrisonersDilemmaPayouts.MUTUAL_DEFECTION];
    } else if (playerOneMove == PrisonersDilemmaMoves.COOPERATE &&
               playerTwoMove == PrisonersDilemmaMoves.COOPERATE) {
      return [PrisonersDilemmaPayouts.MUTUAL_COOPERATION,
              PrisonersDilemmaPayouts.MUTUAL_COOPERATION];
    } else if (playerOneMove == PrisonersDilemmaMoves.COOPERATE &&
               playerTwoMove == PrisonersDilemmaMoves.DEFECT) {
      return [PrisonersDilemmaPayouts.COOPERATION,
              PrisonersDilemmaPayouts.DEFECTION];
    } else {
      return [PrisonersDilemmaPayouts.DEFECTION,
              PrisonersDilemmaPayouts.COOPERATION];
    }

  }
}

