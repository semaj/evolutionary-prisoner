interface Matcher {
  Map<Player, Player> matchUp(int round);
}

class RandomMatcher implements Matcher {
  List<Player> players;
  RandomMatcher(List<Player> players) {
    this.players = players;
  }
  
  Map<Player, Player> matchUp(int round) {
    Map<Player, Player> result = new HashMap<Player, Player>();
    Collections.shuffle(players);
    for (int i = 0; i < players.size(); i += 2) {
      result.put(players.get(i), players.get(i + 1));
    }
    return result;
  }
}

interface Learner {
  // Modifies players based on their payouts from last round
  void learn(Map<Player, Integer> lastRound);
}

class RandomLearner implements Learner {
  RandomLearner() {
    
  }
  
  void learn(Map<Player, Integer> lastRound) {
    for (Player player : lastRound.keySet()) {
      int r = round(random(1, 2));
      Strategy strategy = new TitForTat();
      if (r == 1) {
        strategy = new AllDefect();
      }
      player.setStrategy(strategy);
    }
  }
}