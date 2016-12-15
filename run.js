"use strict"; "use strong"
let FRESH = 0;
let STARTED = 1;
let STATE = FRESH;

// GUI variables
let neighborhoodSize;
let neighborhoodSizeText;
let neighborhoodProp;
let neighborhoodPropText;
let numRounds;
let numRoundsText;
let gamesPerRound;
let gamesPerRoundText;
let matcher;
let matcherInst;
let learner;
let learnerInst;

let matchers = [ "Neighborhood", "Random" ];
let learners = [ "Neighborhood", "Overall", "Random" ];
let strategies = [ "Tit-for-Tat", "Always Defect", "Always Cooperate" ];
let strategy1;
let strategy2;
let strategy3;
let strategy1Text;
let strategy2Text;
let strategy3Text;

// globals
let players;
let tournament;
let width = 40;
let height = 40;
let squareSize = 15;
let sliderWidth = "150px";

function matchersSelect() {
  matcher = createSelect();
  matcher.position(10, 200);
  let matcherText = createDiv("Matcher Type:");
  matcherText.position(10, 180);
  matchers.forEach(function(name) {
    matcher.option(name);
  });
  matcher.value(matchers[0]);
}

function getMatcher() {
  let matcherInst;
  switch (matcher.value()) {
    case "Neighborhood":
      matcherInst = new NeighborhoodMatcher(neighborhoodSize.value(),
                                            players,
                                            neighborhoodProp.value() / 100);
      break;
    case "Random":
      matcherInst = new RandomMatcher(neighborhoodSize.value(),
                                      players,
                                      neighborhoodProp.value() / 100);
      break;
  }
  return matcherInst;
}

function learnersSelect() {
  learner = createSelect();
  learner.position(10, 250);
  let learnerText = createDiv("Learner Type:");
  learnerText.position(10, 230);
  learners.forEach(function(name) {
    learner.option(name);
  });
  learner.value(learners[0]);
}

function getLearner() {
  let learnerInst;
  switch (learner.value()) {
    case "Neighborhood":
      learnerInst = new NeighborhoodLearner(neighborhoodSize.value(),
                                            players);
      break;
    case "Random":
      learnerInst = new RandomLearner();
      break;
    case "Overall":
      learnerInst = new OverallLearner();
      break;
  }
  return learnerInst;
}

function neighborhoodSizeSlider() {
  neighborhoodSize = createSlider(1, 10, 1);
  neighborhoodSize.position(10, 300);
  neighborhoodSize.style('width', sliderWidth);
  neighborhoodSizeText = createDiv("Neighborhood Size: " + neighborhoodSize.value());
  neighborhoodSizeText.position(10, 280);
  neighborhoodSize.changed(function(x) {
    neighborhoodSizeText.html("Neighborhood Size: " + neighborhoodSize.value());
    initialize();
  });
}

function neighborhoodPropSlider() {
  neighborhoodProp = createSlider(0, 100, 50);
  neighborhoodProp.position(10, 340);
  neighborhoodProp.style('width', sliderWidth);
  neighborhoodPropText = createDiv("Neighborhood Bias: " + neighborhoodProp.value() / 100);
  neighborhoodPropText.position(10, 320);
  neighborhoodProp.changed(function(x) {
    neighborhoodPropText.html("Neighborhood Bias: " + neighborhoodProp.value() / 100);
    initialize();
  });
}

function numRoundsSlider() {
  numRounds = createSlider(1, 10, 1);
  numRounds.position(10, 380);
  numRounds.style('width', sliderWidth);
  numRoundsText = createDiv("Number of Rounds: " + numRounds.value());
  numRoundsText.position(10, 360);
  numRounds.changed(function(x) {
    numRoundsText.html("Number of Rounds: " + numRounds.value());
    initialize();
  });
}

function gamesPerRoundSlider() {
  gamesPerRound = createSlider(1, 30, 15);
  gamesPerRound.position(10, 420);
  gamesPerRound.style('width', sliderWidth);
  gamesPerRoundText = createDiv("Number of Games per Round: " + gamesPerRound.value());
  gamesPerRoundText.position(10, 400);
  gamesPerRound.changed(function(x) {
    gamesPerRoundText.html("Number of Games per round: " + gamesPerRound.value());
    initialize();
  });
}

function strategy1Select() {
  strategy1 = createSelect();
  strategy1.position(10, 460);
  let strategy1Text = createDiv("Strategy 1:");
  strategy1Text.position(10, 440);
  strategies.forEach(function(name) {
    strategy1.option(name);
  });
  strategy1.changed(function(x) {
    initialize();
  });
  strategy1.value(strategies[0]);
}

function strategy2Select() {
  strategy2 = createSelect();
  strategy2.position(10, 510);
  let strategy2Text = createDiv("Strategy 2:");
  strategy2Text.position(10, 490);
  strategies.forEach(function(name) {
    strategy2.option(name);
  });
  strategy2.changed(function(x) {
    initialize();
  });
  strategy2.value(strategies[1]);
}

function strategy3Select() {
  strategy3 = createSelect();
  strategy3.position(10, 560);
  let strategy3Text = createDiv("Strategy 3:");
  strategy3Text.position(10, 540);
  strategies.forEach(function(name) {
    strategy3.option(name);
  });
  strategy3.changed(function(x) {
    initialize();
  });
  strategy3.value(strategies[2]);
}

function getStrategy(select) {
  switch (select.value()) {
    case "Always Cooperate":
      return new AllCooperate();
      break;
    case "Always Defect":
      return new AllDefect();
      break;
    case "Tit-for-Tat":
      return new TitForTat();
      break;
  }
}


function setup() {
  strategy1Select();
  strategy2Select();
  strategy3Select();
  matchersSelect();
  learnersSelect();
  neighborhoodSizeSlider();
  neighborhoodPropSlider();
  numRoundsSlider();
  gamesPerRoundSlider();
  noLoop();
  initialize();
  //frameRate(3);
  let c = createCanvas(800, 800);
  c.parent("sketch");
  stroke(255);
}

function initialize() {
  players = [];
  let pd = new PrisonersDilemma();
  for (let i = 0; i < height; i++) {
    let row = [];
    for (let j = 0; j < width; j++) {
      let r = Math.round(random(1, 3));
      let strategy;
      if (r == 1) {
        strategy = getStrategy(strategy1);
      } else if (r == 2) {
        strategy = getStrategy(strategy2);
      } else {
        strategy = getStrategy(strategy3);
      }

      row.push(new Player(i, j, strategy));
    }
    players.push(row);
  }
  tournament = new Tournament(pd, getMatcher(), players, getLearner(), numRounds.value(), gamesPerRound.value());
  redraw();
}

function keyPressed() {
  if (keyCode == ENTER) {
    tournament.play();
    redraw();
    STATE == STARTED;
  } else if (keyCode == BACKSPACE) {
    STATE = FRESH;
    initialize();
  }
}

function draw() {
  Player.flatPlayers(players).forEach(function(player) {
    fill(player.getStrategy().color());
    rect(player.x  * squareSize, player.y * squareSize, squareSize, squareSize);
  });
}
