"use strict";

var util = require('./util');

var checkHitRbiPreS12 = function checkHitRbiPreS12(analysis, update) {
  // from some non-exhaustive research, i think there weren't any grand slams
  // pre-s12 that were not 4 runs
  if (analysis.hitMeta.kind === 'grandSlam') {
    analysis.runsScored = 4;
    return;
  } // if a single/double/triple was hit & x runs were scored, it shows up
  // at the end of the update as "...! x scores"


  var match = update.match(/! (\d+) scores/);

  if (match) {
    analysis.runsScored = parseInt(match[1]);
    return;
  } // if a solo home run was hit, update contains the text "solo home run"


  if (update.indexOf('solo home run') >= 0) {
    analysis.runsScored = 1;
    return;
  } // if a multi-run home run was hit, update contains the text "x-run home
  // run"


  match = update.match(/(\d+)-run home run/);

  if (match) {
    analysis.runsScored = parseInt(match[0]);
    return;
  }
};

var check = function check(analysis, eventData) {
  var update = util.getUpdateText(eventData);

  if (update.indexOf('hits a single') >= 0) {
    analysis.hitMeta.kind = 'single';
  } else if (update.indexOf('hits a double') >= 0) {
    analysis.hitMeta.kind = 'double';
  } else if (update.indexOf('hits a triple') >= 0) {
    analysis.hitMeta.kind = 'triple';
  } else if (update.indexOf('home run') >= 0) {
    analysis.hitMeta.kind = 'homeRun';
  } else if (update.indexOf('grand slam') >= 0) {
    analysis.hitMeta.kind = 'grandSlam';
  }

  if (analysis.hitMeta.kind) {
    analysis.hit = true; // check if home run / grand slam landed in big bucket

    if (update.indexOf('ball lands in a big bucket') >= 0) {
      analysis.hitMeta.bigBucket = true;
    } // from s12 onward, scores on the play are in the scoreUpdate field


    var scoreUpdate = (eventData === null || eventData === void 0 ? void 0 : eventData.scoreUpdate) || '';

    if (scoreUpdate) {
      analysis.runsScored = parseInt(scoreUpdate.match(/^\d+/)[0]) || 0;
    } else {
      // s2 - s11: no scoreUpdate, have to deduce from the update
      checkHitRbiPreS12(analysis, update);
    }

    return true;
  }

  return false;
};

module.exports = {
  check: check
};