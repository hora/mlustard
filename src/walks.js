const check = (analysis, eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('draws a walk') >= 0
  ) {
    analysis.walk = true;

    // check if any runs were scored on the play
    if (
      updateText.indexOf('scores') >= 0
    ) {
      analysis.runsScored = 1;
    }
    return true;
  }

  return false;
};

module.exports = {
  check,
};

