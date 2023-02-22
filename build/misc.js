"use strict";

var util = require('./util');

var checkMaximumBlaseball = function checkMaximumBlaseball(analysis, eventData) {
  var balls, bases, outs, strikes;

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

  if (eventData.halfInningOuts === outs - 1 && eventData.atBatBalls === balls - 1 && eventData.atBatStrikes === strikes - 1 && eventData.baserunnerCount === bases - 1) {
    analysis.maximumBlaseball = true;
  }
};

var checkScoreUpdate = function checkScoreUpdate(analysis, eventData) {
  var _eventData$scoreUpdat, _eventData$data, _eventData$data$chang, _eventData$data2, _eventData$data2$chan;

  var scoreUpdate = eventData === null || eventData === void 0 ? void 0 : (_eventData$scoreUpdat = eventData.scoreUpdate) === null || _eventData$scoreUpdat === void 0 ? void 0 : _eventData$scoreUpdat.toLowerCase(); // available after s12, in chronicler v1

  if (scoreUpdate) {
    analysis.runsScored = util.getNumber(scoreUpdate, null, / runs? score/);
    analysis.unrunsScored = util.getNumber(scoreUpdate, null, / unruns? score/);
  } else if (eventData !== null && eventData !== void 0 && (_eventData$data = eventData.data) !== null && _eventData$data !== void 0 && (_eventData$data$chang = _eventData$data.changedState) !== null && _eventData$data$chang !== void 0 && _eventData$data$chang.homeScore || eventData !== null && eventData !== void 0 && (_eventData$data2 = eventData.data) !== null && _eventData$data2 !== void 0 && (_eventData$data2$chan = _eventData$data2.changedState) !== null && _eventData$data2$chan !== void 0 && _eventData$data2$chan.awayScore) {
    analysis.score = true;
  }
};

var check = function check(analysis, eventData) {
  var _eventData$data3, _eventData$data3$chan, _eventData$data3$chan2;

  var update = util.getUpdateText(eventData);
  checkScoreUpdate(analysis, eventData);
  checkMaximumBlaseball(analysis, eventData); // check for whether a batter just showed up to bat

  if (update.indexOf('batting for') >= 0 || eventData !== null && eventData !== void 0 && (_eventData$data3 = eventData.data) !== null && _eventData$data3 !== void 0 && (_eventData$data3$chan = _eventData$data3.changedState) !== null && _eventData$data3$chan !== void 0 && (_eventData$data3$chan2 = _eventData$data3$chan.batter) !== null && _eventData$data3$chan2 !== void 0 && _eventData$data3$chan2.id) {
    analysis.batterUp = true;
  }
};

module.exports = {
  check: check
};