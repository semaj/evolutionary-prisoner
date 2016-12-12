interface Strategy {
  int play(Player opponent);
  void retroUpdate(Player opponent, int move);
  String getName();
}

class TitForTat implements Strategy {
  public static final String name = "TIT-FOR-TAT";
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
  
  String getName() {
    return name;
  }
    
}

class AllDefect implements Strategy {
  public static final String name = "ALL-DEFECT";
  int play(Player opponent) {
    return PrisonersDilemma.Moves.DEFECT;
  }
  
  void retroUpdate(Player opponent, int move) { }
  
  String getName() {
    return name;
  }
}