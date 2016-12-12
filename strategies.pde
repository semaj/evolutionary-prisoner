interface Strategy {
  int play(Player opponent);
  void retroUpdate(Player opponent, int move);
}

class TitForTat implements Strategy {
  Map<Player, Integer> history;
  TitForTat() {
    history = new HashMap<Player, Integer>();
  }
  
  int play(Player opponent) {
    if (history.containsKey(opponent)) {
      return history.get(opponent);
    } else {
      return PrisonersDilemma.Moves.COOPERATE;
    }
  }
  
  void retroUpdate(Player opponent, int move) {
    history.put(opponent, move);
  }
}