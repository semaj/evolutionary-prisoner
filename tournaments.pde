import java.util.Map;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;


class Tournament {
  Matcher matcher;
  float clustering;
  int numRounds;
  List<Player> players;
  Game game;
  LearningRule rule;
  Tournament(Game game, Matcher matcher, float clustering, int numRounds, List<Player> players, LearningRule rule) {
    this.game = game;
    this.rule = rule;
    this.players = players;
    this.matcher = matcher;
    this.clustering = clustering;
    this.numRounds = numRounds;
  }
  
  void play() {
    Map<Player, AtomicInteger> payouts = new HashMap<Player, AtomicInteger>();
    for (int i = 0; i < this.numRounds; i++) {
      // Initialize player payouts to 0
      for (Player player : players) {
        payouts.put(player, new AtomicInteger(0));
      }
      for (Map.Entry<Player, Player> entry : this.matcher.matchUp(numRounds).entrySet()) {
        Player playerOne = entry.getKey();
        Player playerTwo = entry.getValue();
        Tuple<Integer, Integer> results = this.game.versus(playerOne, playerTwo);
        payouts.get(playerOne).getAndAdd(results.first());
        payouts.get(playerTwo).getAndAdd(results.second());
      }
      this.rule.learn(payouts);
    }
  }
}