import { Dictionary } from 'typescript-collections';
import { Player } from "./players";
import { Strategy, TitForTat, AllDefect } from "./strategies";

export interface Matcher {
  matchUp(games: number): Dictionary<Player, Player[]>;
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export class RandomMatcher implements Matcher {
  constructor(private players: Player[]) {
  }

  matchUp(games: number): Dictionary<Player, Player[]> {
    let result = new Dictionary<Player, Player[]>();
    let that = this;
    this.players.forEach((player: Player) => {
      let games_temp = games;
      let matches: Player[] = [];
      while (games_temp > 0) {
        let index = Math.floor(Math.random() * this.players.length);
        let opponent = this.players[index];
        if (opponent == player) {
          continue;
        }
        matches.push(opponent);
        games_temp--;
      }
      result.setValue(player, matches);
    });
    return result;
  }
}

export interface Learner {
  // Modifies players based on their payouts from last round
  learn(lastRound: Dictionary<Player, number>): void;
}

export class RandomLearner implements Learner {

  learn(lastRound: Dictionary<Player, number>): void {
    lastRound.keys().forEach(function(player: Player) {
      let r = Math.round(Math.random());
      let strategy: Strategy = new TitForTat();
      if (r == 0) {
        strategy = new AllDefect();
      }
      player.setStrategy(strategy);
    });
  }
}
