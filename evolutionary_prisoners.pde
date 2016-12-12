List<Player> players = new ArrayList<Player>();
Tournament t; 
void setup() {
  Game pd = new PrisonersDilemma();
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
      int r = round(random(1, 2));
      Strategy strategy = new TitForTat();
      if (r == 1) {
        strategy = new AllDefect();
      }
        
      players.add(new Player(i, j, strategy));
    }
  }
  Matcher matcher = new RandomMatcher(players);
  Learner learner = new RandomLearner();
  t = new Tournament(pd, matcher, 1, 15, players, learner);
  size(800, 800);
  stroke(255);
}

void draw() {
  final int modifier = 50;
  for (Player player : players) {  
    if (player.getStrategy().getName() == AllDefect.name) {
      fill(153);
    } else {
      fill(204, 102, 0);
    }
    rect(player.x  * modifier, player.y * modifier, modifier, modifier);
  }
  t.play();
}