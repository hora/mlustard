//const util = require('./util');

const BASES = ['first', 'second', 'third', 'fourth'];

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
        playerName: eventData.baseRunnerNames?.[i] || '',
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

