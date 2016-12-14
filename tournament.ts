import { Dictionary } from 'typescript-collections';
import { Player } from "./players";
import { Game } from "./games";
import { Learner, Matcher } from "./rules";

export class Tournament {

  constructor(private game: Game, private matcher: Matcher, private players: Player[][], private learner: Learner, private clustering: number, private numRounds: number, private gamesPerRound: number) {
  }

  play(): void {
    let payouts = new Dictionary<Player, number>();
    Player.flatPlayers(this.players).forEach(function(player: Player) {
      payouts.setValue(player, 0);
    });
    for (let i = 0; i < this.numRounds; i++) {
      this.matcher.matchUp(this.gamesPerRound)
            .forEach((player: Player, opponents: Player[]) => {
        opponents.forEach((opponent: Player) => {
          let results: [number, number] = this.game.versus(player, opponent);
          payouts.setValue(player, payouts.getValue(player) + results[0]);
          payouts.setValue(opponent, payouts.getValue(opponent) + results[1]);
        });
      });
    }
    this.learner.learn(payouts, this.players);
  }

  getPlayers(): Player[][] {
    return this.players;
  }
}

