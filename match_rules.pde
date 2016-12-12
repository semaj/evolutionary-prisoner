interface Matcher {
  Map<Player, Player> matchUp(int round);
}

interface LearningRule {
  // Modifies players based on their payouts from last round
  void learn(Map<Player, Integer> lastRound);
}