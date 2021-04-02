const check = (analysis, eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('flyout') >= 0
  ) {
    analysis.outMeta.kind = 'fly';
  } else if (
    updateText.indexOf('ground out') >= 0
  ) {
    analysis.outMeta.kind = 'ground';
  } else if (
    updateText.indexOf('strikes out') >= 0
  ) {
    analysis.outMeta.kind = 'strike';
  }

  if (
    updateText.indexOf('sacrifice') >= 0
  ) {
    // this may already be a ground/flyout, or its unspecified
    analysis.outMeta.kind = analysis.outMeta.kind || 'unspecified';
    
    analysis.outMeta.sacrifice = true;

    // todo: also log how many advances were on the play

    // check if any runs were scored on the play
    if (
      updateText.indexOf('scores') >= 0
    ) {
      analysis.runsScored = 1;
    }
  }

  if (analysis.outMeta.kind) {
    analysis.out = true;

    if (eventData.halfInningOuts === 0) {
      analysis.gameStatus = 'halfInningEnd';
    }

    return true;
  }

  return false;
};

module.exports = {
  check,
};

