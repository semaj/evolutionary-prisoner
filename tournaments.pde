import java.util.Map;
import java.util.List;
import java.util.Collections;

class Tournament {
  Matcher matcher;
  float clustering;
  int numRounds;
  List<Player> players;
  Game game;
  Learner rule;
  
  Tournament(Game game, Matcher matcher, float clustering, int numRounds, List<Player> players, Learner rule) {
    this.game = game;
    this.rule = rule;
    this.players = players;
    this.matcher = matcher;
    this.clustering = clustering;
    this.numRounds = numRounds;
  }
  
  void play() {
    Map<Player, Integer> payouts = new HashMap<Player, Integer>();
    for (int i = 0; i < this.numRounds; i++) {
      // Initialize player payouts to 0
      for (Player player : players) {
        payouts.put(player, 0);
      }
      for (Map.Entry<Player, Player> entry : this.matcher.matchUp(numRounds).entrySet()) {
        Player playerOne = entry.getKey();
        Player playerTwo = entry.getValue();
        Tuple<Integer, Integer> results = this.game.versus(playerOne, playerTwo);
        payouts.put(playerOne, payouts.get(playerOne) + results.first());
        payouts.put(playerTwo, payouts.get(playerTwo) + results.second());
      }
      this.rule.learn(payouts);
    }
  }
}