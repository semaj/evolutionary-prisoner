class Player {
  int x;
  int y;
  Strategy strategy;
  Player(int x, int y, Strategy strategy) {
    this.x = x;
    this.y = y;
    this.strategy = strategy;
  }
  
  int play(Player opponent) {
    return this.strategy.play(opponent);
  }
  
  void retroUpdate(Player opponent, int move) {
    this.strategy.retroUpdate(opponent, move);
  }
  
  Strategy getStrategy() {
    return this.strategy;
  }
  
  void setStrategy(Strategy strategy) {
    this.strategy = strategy;
  }
}