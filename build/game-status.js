"use strict";

var util = require('./util');

var check = function check(analysis, eventData) {
  var _eventData$homeTeamNi, _eventData$awayTeamNi;

  var update = util.getUpdateText(eventData);
  var home = (eventData === null || eventData === void 0 ? void 0 : (_eventData$homeTeamNi = eventData.homeTeamNickname) === null || _eventData$homeTeamNi === void 0 ? void 0 : _eventData$homeTeamNi.toLowerCase()) || '';
  var homeScore = (eventData === null || eventData === void 0 ? void 0 : eventData.homeScore) || 0;
  var away = (eventData === null || eventData === void 0 ? void 0 : (_eventData$awayTeamNi = eventData.awayTeamNickname) === null || _eventData$awayTeamNi === void 0 ? void 0 : _eventData$awayTeamNi.toLowerCase()) || '';
  var awayScore = (eventData === null || eventData === void 0 ? void 0 : eventData.awayScore) || 0;

  if (update.indexOf('play ball') >= 0) {
    analysis.gameStatus = 'beforeFirstPitch';
  } else if (update.indexOf('top of') >= 0) {
    analysis.gameStatus = 'firstHalfInningStart';
  } else if (update.indexOf('bottom of') >= 0) {
    analysis.gameStatus = 'secondHalfInningStart';
  } else if (update.indexOf('game over') >= 0 || update.indexOf("".concat(home, " ").concat(homeScore, ", ").concat(away, " ").concat(awayScore)) >= 0 || update.indexOf("".concat(away, " ").concat(awayScore, ", ").concat(home, " ").concat(homeScore)) >= 0) {
    analysis.gameStatus = 'gameEnd';
  }

  if (analysis.gameStatus) {
    return analysis;
  }

  return false;
};

module.exports = {
  check: check
};