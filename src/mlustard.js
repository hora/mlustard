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
    },

    // --- Hits
    // --------
    // collects information about the hit on the play
    hit: {
      // true when there is a hit on the play
      isHit: false,
      // one of: 'single', 'double', 'triple', 'homeRun'
      kind: null,
      // the number of runs batted in with this hit
      rbi: 0,
      // whether a Big Bucket was activated by the hit
      bigBucket: false,
    },
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

const checkHitRbiPreS12 = (updateText) => {
  // if a single/double/triple was hit & x runs were scored, it shows up
  // at the end of the updateText as "...! x scores"
  let match = updateText.match(/! (\d+) scores/);

  if (match) {
    analysis.hit.rbi = parseInt(match[1]);
    return;
  }

  // if a solo home run was hit, updateText contains the text "solo home run"
  if (
    updateText.indexOf('solo home run') >= 0
  ) {
    analysis.hit.rbi = 1;
    return;
  }

  // if a multi-run home run was hit, updateText contains the text "x-run home
  // run"
  match = updateText.match(/(\d+)-run home run/);

  if (match) {
    analysis.hit.rbi = parseInt(match[0]);
    return;
  }
};

const doHitsCheck = (eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('hits a Single') >= 0
  ) {
    analysis.hit.kind = 'single';
  } else if (
    updateText.indexOf('hits a Double') >= 0
  ) {
    analysis.hit.kind = 'double';
  } else if (
    updateText.indexOf('hits a Triple') >= 0
  ) {
    analysis.hit.kind = 'triple';
  } else if (
    updateText.indexOf('home run') >= 0
  ) {
    analysis.hit.kind = 'homeRun';

    if (
      updateText.indexOf('ball lands in a Big Bucket') >= 0
    ) {
      analysis.hit.bigBucket = true;
    }
  }

  if (analysis.hit.kind) {
    analysis.hit.isHit = true;

    // from s12 onward, scores on the play are in the scoreUpdate field
    const scoreUpdate = eventData.scoreUpdate;
    if (scoreUpdate) {
      analysis.hit.rbi = parseInt(scoreUpdate.match(/^\d+/)[0]) || 0;

    } else { // s2 - s11: no scoreUpdate, have to deduce from the updateText
      checkHitRbiPreS12(updateText);
    }

  }
};

const analyzeGameEvent = (eventData) => {
  if (!eventData) { return null }

  initAnalysis(eventData);

  doGameStatusCheck(eventData);
  doOutsCheck(eventData);
  doHitsCheck(eventData);

  return analysis;
};

module.exports = {
  analyzeGameEvent
};

