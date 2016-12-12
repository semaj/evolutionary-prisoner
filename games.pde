interface Game {

  Tuple<Integer, Integer> versus(Player one, Player two);
}

class PrisonersDilemma implements Game {
  public class Moves {
    public static final int DEFECT = 0;
    public static final int COOPERATE = 1;
  }

  public class Payouts {
    public static final int MUTUAL_COOPERATION = 3;
    public static final int MUTUAL_DEFECTION = -1;
    public static final int DEFECTION = 4;
    public static final int COOPERATION = 0;
  }
  Tuple<Integer, Integer> versus(Player one, Player two) {
    int playerOneMove = one.play(two);
    int playerTwoMove = two.play(one);
    if (playerOneMove == Moves.DEFECT && playerTwoMove == Moves.DEFECT) {
      return new Tuple(Payouts.MUTUAL_DEFECTION, Payouts.MUTUAL_DEFECTION);
    } else if (playerOneMove == Moves.COOPERATE && playerTwoMove == Moves.COOPERATE) {
      return new Tuple(Payouts.MUTUAL_COOPERATION, Payouts.MUTUAL_COOPERATION);
    } else if (playerOneMove == Moves.COOPERATE && playerTwoMove == Moves.DEFECT) {
      return new Tuple(Payouts.COOPERATION, Payouts.DEFECTION);
    } else {
      return new Tuple(Payouts.DEFECTION, Payouts.COOPERATION);
    }
  }
}

class Tuple<T, R> {
  T first;
  R second;
  Tuple(T first, R second) {
    this.first = first;
    this.second = second;
  }
  
  T first() {
    return this.first;
  }
  
  R second() {
    return this.second;
  }
}