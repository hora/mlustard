"use strict";

//const util = require('./util');
var players = require('../lib/players').players;

var BASES = ['first', 'second', 'third', 'fourth'];

var getBaserunnerName = function getBaserunnerName(eventData, i) {
  var _eventData$baseRunner;

  var name = ((_eventData$baseRunner = eventData.baseRunnerNames) === null || _eventData$baseRunner === void 0 ? void 0 : _eventData$baseRunner[i]) || ''; // try looking the name up by the id

  if (!name) {
    var player = players.filter(function (p) {
      return p.player_id === eventData.baseRunners[i];
    })[0];

    if (player) {
      name = player.player_name;
    }
  }

  return name;
};

var check = function check(analysis, eventData) {
  //const update = util.getUpdateText(eventData);
  if (eventData.baserunnerCount) {
    // i represents the order of baserunners
    // basesOccupied[i] is the base they are on, 0-indexed
    for (var i = 0; i < eventData.basesOccupied.length; i++) {
      var base = eventData.basesOccupied[i];
      analysis.baseRunners[BASES[base]] = {
        playerName: getBaserunnerName(eventData, i),
        playerId: eventData.baseRunners[i]
      };
    }

    return true;
  }

  return false;
};

module.exports = {
  check: check
};