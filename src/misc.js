const util = require('./util');

const checkMaximumBlaseball = (analysis, eventData) => {
  let balls, bases, outs, strikes;

  if (eventData.topOfInning) {
    // away is batting
    balls = eventData.awayBalls;
    bases = eventData.awayBases;
    outs = eventData.awayOuts;
    strikes = eventData.awayStrikes;

  } else {
    // home is batting
    balls = eventData.homeBalls;
    bases = eventData.homeBases;
    outs = eventData.homeOuts;
    strikes = eventData.homeStrikes;
  }

  if (
    eventData.halfInningOuts === outs - 1 &&
    eventData.atBatBalls === balls - 1 &&
    eventData.atBatStrikes === strikes - 1 &&
    eventData.baserunnerCount === bases - 1
  ) {
    analysis.maximumBlaseball = true;
  }
};

const check = (analysis, eventData) => {
  const update = util.getUpdateText(eventData);

  checkMaximumBlaseball(analysis, eventData);

  // check for whether a batter just showed up to bat
  if (
    update.indexOf('batting for') >= 0
  ) {
    analysis.batterUp = true;
  }

};

module.exports = {
  check,
};

