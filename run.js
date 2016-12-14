"use strict"; "use strong"
let players = [];
let t;
function setup() {
  let pd = new PrisonersDilemma();
  for (let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 10; j++) {
      let r = Math.round(random(1, 2));
      let strategy = new TitForTat();
      if (r == 1) {
        strategy = new AllDefect();
      }

      row.push(new Player(i, j, strategy));
    }
    players.push(row);
  }
  let matcher = new RandomMatcher(players);
  let learner = new OverallLearner();
  t = new Tournament(pd, matcher, players, learner, 1, 100, 100);
  frameRate(1);
  createCanvas(800, 800);
  stroke(255);
}

function draw() {
  let modifier = 50;
  Player.flatPlayers(players).forEach(function(player) {
    if (player.strategy.constructor == AllDefect) {
      fill(153);
    } else {
      fill(204, 102, 0);
    }
    rect(player.x  * modifier, player.y * modifier, modifier, modifier);
  });
  t.play();
}
