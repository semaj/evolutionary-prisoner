class Player {
  int x;
  int y;
  Strategy strategy;
  Player(int x, int y, Strategy strategy) {
    this.x = x;
    this.y = y;
    this.strategy = strategy;
  }
  
  Move play(Player opponent) {
    return this.strategy.play(opponent);
  }
}