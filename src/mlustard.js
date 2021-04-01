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
      // one of: 'flyout', 'groundOut', 'strikeOut', 'caughtStealing'
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

    // --- Steals
    // ----------
    // collects information about the steal on the play
    steal: {
      // true when there is a steal on the play
      isSteal: false,
      // true when thief not caught, false otherwise
      success: null,
      // which base was stolen (0-indexed)
      baseStolen: null,
      // how many runs were scored as a result
      runsScored: 0,
    },

    // --- Walks
    // ---------
    // collects information about the walk on the play
    walk: {
      // true when there is a walk on the play
      isWalk: false,
      // how many walks were scored as a result
      runsScored: 0,
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

const doStealsCheck = (eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('steal') >= 0
  ) {
    analysis.steal.isSteal = true;

    if (
      updateText.indexOf('caught') >= 0
    ) {
      analysis.steal.success = false;
      analysis.out.isOut = true;
      analysis.out.kind = 'caughtStealing';
    } else {
      analysis.steal.success = true;
    }

    if (
      updateText.search(/steal.*first/) !== -1
    ) {
      analysis.steal.baseStolen = 0;
    } else if (
      updateText.search(/steal.*second/) !== -1
    ) {
      analysis.steal.baseStolen = 1;
    } else if (
      updateText.search(/steal.*third/) !== -1
    ) {
      analysis.steal.baseStolen = 2;
    } else if (
      updateText.search(/steal.*fourth/) !== -1
    ) {
      analysis.steal.baseStolen = 3;

      // this may have been a run if there are 4 bases in play
      if (
        analysis.steal.success &&
        eventData.homeBatter !== null &&
        eventData.awayBases === 4
      ) {
        analysis.steal.runsScored = 1;
      } else if (
        analysis.steal.success &&
        eventData.awayBatter !== null &&
        eventData.homeBases === 4
      ) {
        analysis.steal.runsScored = 1;
      }

    } else if (
      updateText.search(/steal.*home/) !== -1
    ) {

      // see if home or away stole the base
      if (eventData.homeBatter !== null) {
        analysis.steal.baseStolen = eventData.awayBases - 1 || 3;
      } else if (eventData.awaBatter !== null) {
        analysis.steal.baseStolen = eventData.homeBases - 1 || 3;
      } else {
        // older games don't have these fields, or may have both
        // home and away batters filled in; just assumed home base
        // is base #3 in those cases, i guess
        analysis.steal.baseStolen = 3;
      }

      analysis.steal.runsScored = 1;
    }

  return true;

  } else {
    return false;
  }

};

const doWalksCheck = (eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('draws a walk') >= 0
  ) {
    analysis.walk.isWalk = true;

    // check if any runs were scored on the play
    if (
      updateText.indexOf('scores') >= 0
    ) {
      analysis.walk.runsScored = 1;
    }
    return true;
  }

  return false;
};

const analyzeGameEvent = (eventData) => {
  if (!eventData) { return null }

  initAnalysis(eventData);

  doGameStatusCheck(eventData);
  doOutsCheck(eventData);
  doHitsCheck(eventData);

  if (doStealsCheck(eventData)) {
    return analysis;
  }

  if (doWalksCheck(eventData)) {
    return analysis;
  }

  return analysis;
};

module.exports = {
  analyzeGameEvent
};

