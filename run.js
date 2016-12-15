"use strict"; "use strong"
let FRESH = 0;
let STARTED = 1;
let STOPPED = 2;
let STATE = FRESH;

// GUI variables
let neighborhoodSize;
let neighborhoodSizeText;
let neighborhoodProp;
let neighborhoodPropText;
let numRounds = 10;
let numGamesPerRound = 1;
let strategyNames = ['Tit For Tat', 'All Defect', 'All Cooperate'];

let gui;


// globals
let players;
let tournament;
let width = 40;
let height = 40;
let squareSize = 15;

function neighborhoodSizeSlider() {
  neighborhoodSize = createSlider(1, 10, 1);
  neighborhoodSize.position(10, 300);
  neighborhoodSize.style('width', '80px');
  neighborhoodSizeText = createDiv("Neighborhood Size: " + neighborhoodSize.value());
  neighborhoodSizeText.position(10, 280);
}

function neighborhoodPropSlider() {
  neighborhoodProp = createSlider(1, 10, 1);
  neighborhoodProp.position(10, 340);
  neighborhoodProp.style('width', '80px');
  neighborhoodPropText = createDiv("Neighborhood Proportion: " + neighborhoodProp.value());
  neighborhoodPropText.position(10, 320);
}

function setup() {

  neighborhoodSizeSlider();
  neighborhoodPropSlider();
  //noLoop();
  frameRate(10);
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
      let r = Math.round(random(1, 5));
      let strategy = new TitForTat();
      if (r >= 2) {
        strategy = new AllDefect();
      }

      row.push(new Player(i, j, strategy));
    }
    players.push(row);
  }
  let matcher = new NeighborhoodMatcher(neighborhoodSize.value(),
                                        players,
                                        neighborhoodProportion);
  let learner = new OverallLearner();
  tournament = new Tournament(pd, matcher, players, learner, 10, 1);
}

function keyPressed() {
  if (keyCode == ENTER) {
    if (STATE == STOPPED) {
      loop();
      STATE = STARTED;
    } else if (STATE == STARTED) {
      STATE = STOPPED;
      noLoop();
    } else if (STATE == FRESH) {
      initialize();
      STATE = STARTED;
      loop();
    }
  } else if (keyCode == BACKSPACE) {
    STATE = FRESH;
    redraw();
  }
}

function draw() {
  if (STATE == STARTED) {
    Player.flatPlayers(players).forEach(function(player) {
      if (player.strategy.constructor == AllDefect) {
        fill(10, 30, 10);
      } else {
        fill(204, 102, 0);
      }
      rect(player.x  * squareSize, player.y * squareSize, squareSize, squareSize);
    });
    tournament.play();
  } else if (STATE == FRESH) {
    for (let i = 0; i < height; i++) {
      fill(210);
      for (let j = 0; j < width; j++) {
        rect(i * squareSize, j * squareSize, squareSize, squareSize);
      }
    }
  }
}
