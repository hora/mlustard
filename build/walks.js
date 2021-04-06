"use strict";

var util = require('./util');

var check = function check(analysis, eventData) {
  var update = util.getUpdateText(eventData);

  if (update.indexOf('draws a walk') >= 0) {
    analysis.walk = true; // check if any runs were scored on the play

    if (update.indexOf('scores') >= 0) {
      analysis.runsScored = 1;
    }

    return true;
  }

  return false;
};

module.exports = {
  check: check
};