import java.util.Map;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;


class Tournament {
  Matcher matcher;
  float clustering;
  int numRounds;
  List<Player> players;
  Game game;
  Tournament(Game game, Matcher matcher, float clustering, int numRounds, List<Player> players) {
    this.game = game;
    this.players = players;
    this.matcher = matcher;
    this.clustering = clustering;
    this.numRounds = numRounds;
  }
  
  Map<Player, AtomicInteger> play() {
    Map<Player, AtomicInteger> result = new HashMap<Player, AtomicInteger>();
    // Initialize player payouts to 0
    for (Player player : players) {
      result.put(player, new AtomicInteger(0));
    }
    for (int i = 0; i < this.numRounds; i++) {
      for (Map.Entry<Player, Player> entry : this.matcher.matchUp(numRounds).entrySet()) {
        Player playerOne = entry.getKey();
        Player playerTwo = entry.getValue();
        Tuple<Integer, Integer> payouts = this.game.versus(playerOne, playerTwo);
        result.get(playerOne).getAndAdd(payouts.first());
        result.get(playerTwo).getAndAdd(payouts.second());
      }
    }
    return result;
  }
}