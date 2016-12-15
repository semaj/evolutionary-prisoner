import { Dictionary } from 'typescript-collections';
import { Player } from "./players";
import { Game } from "./games";
import { Learner, Matcher } from "./rules";

export class Tournament {

  constructor(private game: Game, private matcher: Matcher,
              private players: Player[][], private learner: Learner,
              private clustering: number, private numRounds: number,
              private gamesPerRound: number, private neighborhood: number) {
  }

  play(): void {
    let payouts = new Dictionary<Player, number>();
    let flat = Player.flatPlayers(this.players);
    if (flat.every((a: Player) => {
      return flat[0].getStrategy().toString() == a.getStrategy().toString()
    })) {
      return;
    }
    flat.forEach(function(player: Player) {
      payouts.setValue(player, 0);
    });
    for (let i = 0; i < this.numRounds; i++) {
    //if (this.numRounds > 0) {
      this.matcher.matchUp(this.gamesPerRound)
            .forEach((player: Player, opponents: Player[]) => {
        opponents.forEach((opponent: Player) => {
          let results: [number, number] = this.game.versus(player, opponent);
          payouts.setValue(player, payouts.getValue(player) + results[0]);
          payouts.setValue(opponent, payouts.getValue(opponent) + results[1]);
        });
      });
    }
    this.learner.learn(payouts);
  }

  getPlayers(): Player[][] {
    return this.players;
  }
}
