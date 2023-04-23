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
    /^top of/.test(update)
  ) {
    analysis.gameStatus = 'firstHalfInningStart';
  } else if (
    /^bottom of/.test(update)
  ) {
    analysis.gameStatus = 'secondHalfInningStart';
  } else if (
    update.indexOf('game over') >= 0 ||
    update.indexOf(`${home} ${homeScore}, ${away} ${awayScore}`) >= 0 ||
    update.indexOf(`${away} ${awayScore}, ${home} ${homeScore}`) >= 0
  ) {
    analysis.gameStatus = 'gameEnd';
  } else if (
    /end of the top/.test(update)
  ) {
    analysis.gameStatus = 'firstHalfInningEnd';
  } else if (
    /end of the bottom/.test(update)
  ) {
    analysis.gameStatus = 'secondHalfInningEnd';
  }

  if (analysis.gameStatus) {
    return analysis;
  }

  return false;
};

module.exports = {
  check,
};

