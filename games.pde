interface Game {

  Tuple<Integer, Integer> versus(Player one, Player two);
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

class Move {
  int move;
  Move(int move) {
    this.move = move;
  }
}