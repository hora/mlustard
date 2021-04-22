"use strict";

var util = require('./util');

var check = function check(analysis, eventData) {
  var update = util.getUpdateText(eventData);

  if (update.indexOf('draws a walk') >= 0) {
    analysis.walk = true; // check if any runs were scored on the play prior to s12

    if (!(eventData !== null && eventData !== void 0 && eventData.scoreUpdate) && update.indexOf('scores') >= 0) {
      analysis.runsScored = 1;
    } // otherwise scores captured in src/misc.js


    return true;
  }

  return false;
};

module.exports = {
  check: check
};