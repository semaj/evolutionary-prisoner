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
  constructor(private players: Player[][]) {
  }

  matchUp(games: number): Dictionary<Player, Player[]> {
    let result = new Dictionary<Player, Player[]>();
    let flat: Player[] = Player.flatPlayers(this.players);
    flat.forEach((player: Player) => {
      let games_temp = games;
      let matches: Player[] = [];
      while (games_temp > 0) {
        let index = Math.floor(Math.random() * flat.length);
        let opponent = flat[index];
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
  learn(payouts: Dictionary<Player, number>, players: Player[][]): void;
}

export class RandomLearner implements Learner {

  learn(payouts: Dictionary<Player, number>, players): void {
    payouts.keys().forEach(function(player: Player) {
      let r = Math.round(Math.random());
      let strategy: Strategy = new TitForTat();
      if (r == 0) {
        strategy = new AllDefect();
      }
      player.setStrategy(strategy);
    });
  }
}

export class OverallLearner implements Learner {

  learn(payouts: Dictionary<Player, number>, players: Player[][]): void {
    let strategyPayouts = new Dictionary<Strategy, number>();
    payouts.forEach((player: Player, payout) => {
      let strategy: Strategy = player.getStrategy();
      if (strategyPayouts.containsKey(strategy)) {
        let currentValue: number = strategyPayouts.getValue(strategy);
        strategyPayouts.setValue(strategy, currentValue + payout);
      } else {
        strategyPayouts.setValue(strategy, payout);
      }
    });
    let sum: number = strategyPayouts.values().reduce((a, b) => a + b);
    players.forEach((player_row: Player[]) => {
      player_row.forEach((player: Player) => {
        let r: number = Math.floor(Math.random() * sum);
        let acc = 0;
        let found = false; // hack
        console.log("here");
        strategyPayouts.forEach((strategy: Strategy, payout: number) => {
          acc += payout;
          if (r < acc && !found) {
            player.setStrategy(strategy);
            found = true;
          }
        });
      });
    });
  }
}

export class NeighborhoodLearner implements Learner {

  learn(payouts: Dictionary<Player, number>, players: Player[][]): void {
    let strategyPayouts = new Dictionary<Strategy, number>();
    payouts.forEach((player: Player, payout) => {
      let strategy: Strategy = player.getStrategy();
      if (strategyPayouts.containsKey(strategy)) {
        let currentValue: number = strategyPayouts.getValue(strategy);
        strategyPayouts.setValue(strategy, currentValue + payout);
      } else {
        strategyPayouts.setValue(strategy, payout);
      }
    });
    let sum: number = strategyPayouts.values().reduce((a, b) => a + b);
    players.forEach((player_row: Player[]) => {
      player_row.forEach((player: Player) => {
        let r: number = Math.floor(Math.random() * sum);
        let acc = 0;
        let found = false; // hack
        console.log("here");
        strategyPayouts.forEach((strategy: Strategy, payout: number) => {
          acc += payout;
          if (r < acc && !found) {
            player.setStrategy(strategy);
            found = true;
          }
        });
      });
    });
  }
}




