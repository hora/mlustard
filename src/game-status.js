const check = (analysis, eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('Play ball') >= 0
  ) {
    analysis.gameStatus = 'beforeFirstPitch';
  } else if (
    updateText.indexOf('Top of') >= 0
  ) {
    analysis.gameStatus = 'firstHalfInningStart';
  } else if (
    updateText.indexOf('Bottom of') >= 0
  ) {
    analysis.gameStatus = 'secondHalfInningStart';
  } else if (
    updateText.indexOf('Game over') >= 0 ||
    updateText.indexOf(`${eventData.homeTeamNickname} ${eventData.homeScore}, ${eventData.awayTeamNickname} ${eventData.awayScore}`) >= 0 ||
    updateText.indexOf(`${eventData.awayTeamNickname} ${eventData.awayScore}, ${eventData.homeTeamNickname} ${eventData.homeScore}`) >= 0
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

