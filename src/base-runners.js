//const util = require('./util');
const players = require('../lib/players').players;

const BASES = ['first', 'second', 'third', 'fourth'];

const getBaserunnerName = (eventData, i) => {
  let name = eventData.baseRunnerNames?.[i] || '';

  // try looking the name up by the id
  if (!name) {
    const player = players.filter((p) => {
      return p.player_id === eventData.baseRunners[i];
    })[0];

    if (player) {
      name = player.player_name;
    }
  }

  return name;
};

const check = (analysis, eventData) => {
  //const update = util.getUpdateText(eventData);

  if (
    eventData.baserunnerCount
  ) {

    // i represents the order of baserunners
    // basesOccupied[i] is the base they are on, 0-indexed
    for (let i = 0; i < eventData.basesOccupied.length; i++) {
      const base = eventData.basesOccupied[i];

      analysis.baseRunners[BASES[base]] = {
        playerName: getBaserunnerName(eventData, i),
        playerId: eventData.baseRunners[i],
      };
    }

    return true;
  }

  return false;
};

module.exports = {
  check,
};

