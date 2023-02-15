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

const checkScoreUpdate = (analysis, eventData) => {
  const scoreUpdate = eventData?.scoreUpdate?.toLowerCase();

  // available after s12, in chronicler v1
  if (scoreUpdate) {
    analysis.runsScored = util.getNumber(scoreUpdate, null, / runs? score/);
    analysis.unrunsScored = util.getNumber(scoreUpdate, null, / unruns? score/);
  } else if (eventData?.data?.changedState?.homeScore || eventData?.data?.changedState?.awayScore) {

  }

};

const check = (analysis, eventData) => {
  const update = util.getUpdateText(eventData);

  checkScoreUpdate(analysis, eventData);
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

