import { Set, Dictionary } from 'typescript-collections';
import { Player } from "./players";
import { Strategy, TitForTat, AllDefect } from "./strategies";
import * as Combinatorics from "js-combinatorics";

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
  constructor(a, private players: Player[][], b) {
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

export class NeighborhoodMatcher implements Matcher {
  playerToNeighbors: Dictionary<Player, Player[]>;

  constructor(private neighborhood: number, private players: Player[][],
              private neighborhoodProportion: number) {
    let nums = new Set<number>();
    for (let i = 0; i <= this.neighborhood; i++) {
      nums.add(i);
      nums.add(i * -1);
    }
    let indexes: [number, number][] = Combinatorics.permutation(nums.toArray(),
                                                                 2);
    let colSize = players.length;
    this.playerToNeighbors = new Dictionary<Player, Player[]>();
    players.forEach((playerRow: Player[]) => {
      let rowSize = playerRow.length;
      playerRow.forEach((player: Player) => {
        let neighbors: Player[] = [];
        indexes.forEach((deltas) => {
          let xDelta = deltas[0];
          let yDelta = deltas[1];
          let iX: number = mod(player.x + xDelta, rowSize);
          let iY: number = mod(player.y + yDelta, colSize);
          let neighbor: Player = players[iX][iY];
          neighbors.push(neighbor);
        });
        this.playerToNeighbors.setValue(player, neighbors);
      });
    });
  }

  matchUp(games: number): Dictionary<Player, Player[]> {
    let result = new Dictionary<Player, Player[]>();
    let flat: Player[] = Player.flatPlayers(this.players);
    flat.forEach((player: Player) => {
      let games_temp = games;
      let matches: Player[] = [];
      while (games_temp > 0) {
        let r = Math.random();
        let neighbors = this.playerToNeighbors.getValue(player);
        let opponent: Player;
        if (r < this.neighborhoodProportion) {
          let index = Math.floor(Math.random() * neighbors.length);
          opponent = neighbors[index];
        } else {
          while (true) {
            let index = Math.floor(Math.random() * flat.length);
            opponent = flat[index];
            if (opponent != player && neighbors.indexOf(opponent) == -1) {
              break;
            }
          }
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
  learn(payouts: Dictionary<Player, number>): void;
}

function getStrategy(s) {
  switch (s) {
    case "Always Cooperate":
      return new AllCooperate();
      break;
    case "Always Defect":
      return new AllDefect();
      break;
    case "Tit-for-Tat":
      return new TitForTat();
      break;
  }
}

export class RandomLearner implements Learner {

  constructor(private strategyNames: string) {}

  learn(payouts: Dictionary<Player, number>): void {
    payouts.keys().forEach(function(player: Player) {
      let r = Math.round(random(0, 2));
      let strategy = getStrategy(strategyNames[r]);
      player.setStrategy(strategy);
    });
  }
}

export class OverallLearner implements Learner {

  learn(payouts: Dictionary<Player, number>): void {
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
    payouts.keys().forEach((player: Player) => {
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
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export class NeighborhoodLearner implements Learner {
  playerToNeighbors: Dictionary<Player, Player[]>;

  constructor(private neighborhood: number, players: Player[][]) {
    let nums = new Set<number>();
    for (let i = 0; i <= this.neighborhood; i++) {
      nums.add(i);
      nums.add(i * -1);
    }
    let indexes: [number, number][] = Combinatorics.permutation(nums.toArray(),
                                                                 2);
    let colSize = players.length;
    this.playerToNeighbors = new Dictionary<Player, Player[]>();
    players.forEach((playerRow: Player[]) => {
      let rowSize = playerRow.length;
      playerRow.forEach((player: Player) => {
        let neighbors: Player[] = [];
        indexes.forEach((deltas) => {
          let xDelta = deltas[0];
          let yDelta = deltas[1];
          let iX: number = mod(player.x + xDelta, rowSize);
          let iY: number = mod(player.y + yDelta, colSize);
          let neighbor: Player = players[iX][iY];
          neighbors.push(neighbor);
        });
        this.playerToNeighbors.setValue(player, neighbors);
      });
    });
  }

  learn(payouts: Dictionary<Player, number>): void {
    this.playerToNeighbors.forEach((player, neighbors) => {
      let strategy: Strategy = player.getStrategy();
      let payout: number = payouts.getValue(player);
      neighbors.forEach((neighbor) => {
        let neighborPayout: number = payouts.getValue(neighbor);
        if (neighborPayout > payout) {
          strategy = neighbor.getStrategy();
          payout = neighborPayout;
        }
      });
      player.setStrategy(strategy);
    });
  }
}
