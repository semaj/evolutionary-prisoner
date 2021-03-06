import { Strategy } from "./strategies";
export class Player {
  constructor(public x: number, public y: number, private strategy: Strategy) { }


  static flatPlayers(players: Player[][]): Player[] {
    return players.reduce((a, b) => a.concat(b));
  }

  play(opponent: Player): number {
    return this.strategy.play(opponent);
  }

  retroUpdate(opponent: Player, move: number): void {
    this.strategy.retroUpdate(opponent, move);
  }

  getStrategy(): Strategy {
    return this.strategy;
  }

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  toString(): string {
    return "Player:" + this.x + "," + this.y;
  }
}
