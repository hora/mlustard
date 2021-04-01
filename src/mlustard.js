let analysis = {};

const initAnalysis = (eventData) => {
  /*
   * set all implemented analysis results to their defaults
   */
  analysis = {
    // the game event ID
    id: eventData.id,

    // --- Game Status
    // ---------------
    // one of:
    // beforeFirstPitch, when the first pitch hasn't been thrown yet
    // firstHalfInningStart, when the first half of an inning is starting
    // secondHalfInningStart, when the second half of an inning is starting
    gameStatus: null,

    // --- Outs
    // --------
    // collects information about out on the play
    out: {
    // true when there is an out on the play
      isOut: false,
      // one of: 'flyout', 'groundOut', 'strikeOut'
      kind: null,
      // true when the out closes out a half inning
      isLastOfHalfInning: null
    }
  };
};

const doGameStatusCheck = (eventData) => {
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
  }

};

const doOutsCheck = (eventData) => {
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

  if (analysis.out.kind) {
    analysis.out.isOut = true;

    if (eventData.halfInningOuts === 0) {
      analysis.out.isLastOfHalfInning = true;
    }
  }

};

const analyzeGameEvent = (eventData) => {
  if (!eventData) { return null }

  initAnalysis(eventData);

  doGameStatusCheck(eventData);
  doOutsCheck(eventData);

  return analysis;
};

module.exports = {
  analyzeGameEvent
};

