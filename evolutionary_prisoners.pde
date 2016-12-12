List<Player> players = new ArrayList<Player>();
Tournament t; 
void setup() {
  Game pd = new PrisonersDilemma();
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
      players.add(new Player(i, j, new TitForTat()));
    }
  }
  Matcher matcher = new RandomMatcher(players);
  Learner learner = new RandomLearner();
  t = new Tournament(pd, matcher, 1, 15, players, learner);
  size(800, 800);
  stroke(255);
}

void draw() {
  background(192, 64, 0);
  line(150, 25, mouseX, mouseY);
}