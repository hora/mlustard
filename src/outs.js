const doSacrificeCheck = (analysis, eventData) => {
  const updateText = eventData.lastUpdate || '';

};

const check = (analysis, eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('flyout') >= 0
  ) {
    analysis.out.kind = 'flyout';
  } else if (
    updateText.indexOf('ground out') >= 0
  ) {
    analysis.out.kind = 'groundOut';
  } else if (
    updateText.indexOf('strikes out') >= 0
  ) {
    analysis.out.kind = 'strikeOut';
  }

  if (
    updateText.indexOf('sacrifice') >= 0
  ) {
    // todo: this isn't really an out kind (which would still be fly/ground),
    // but an extrabit of info. fix this.
    analysis.out.kind = 'sacrifice';

    // todo: also log how many advances were on the play

    // check if any runs were scored on the play
    if (
      updateText.indexOf('scores') >= 0
    ) {
      analysis.out.runsScored = 1;
    }
  }

  if (analysis.out.kind) {
    analysis.out.isOut = true;

    if (eventData.halfInningOuts === 0) {
      analysis.out.isLastOfHalfInning = true;
    }

    return true;
  }

  return false;
};

module.exports = {
  check,
};

