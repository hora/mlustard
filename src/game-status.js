const util = require('./util');

const check = (analysis, eventData) => {
  const update = util.getUpdateText(eventData);
  const home = eventData?.homeTeamNickname?.toLowerCase() || '';
  const homeScore = eventData?.homeScore || 0;
  const away = eventData?.awayTeamNickname?.toLowerCase() || '';
  const awayScore = eventData?.awayScore || 0;

  if (
    update.indexOf('play ball') >= 0
  ) {
    analysis.gameStatus = 'beforeFirstPitch';
  } else if (
    update.indexOf('top of') >= 0
  ) {
    analysis.gameStatus = 'firstHalfInningStart';
  } else if (
    update.indexOf('bottom of') >= 0
  ) {
    analysis.gameStatus = 'secondHalfInningStart';
  } else if (
    update.indexOf('game over') >= 0 ||
    update.indexOf(`${home} ${homeScore}, ${away} ${awayScore}`) >= 0 ||
    update.indexOf(`${away} ${awayScore}, ${home} ${homeScore}`) >= 0
  ) {
    analysis.gameStatus = 'gameEnd';
  }

  if (analysis.gameStatus) {
    return analysis;
  }

  return false;
};

module.exports = {
  check,
};

