const gameStatus = require('./game-status');
const outs = require('./outs');
const hits = require('./hits');
const steals = require('./steals');
const walks = require('./walks');

let analysis = {};

const initAnalysis = (eventData) => {
  /*
   * set all implemented analysis results to their defaults
   */
  analysis = {
    // the game event ID
    id: eventData.id || eventData._id,

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
      // one of: 'flyout', 'groundOut', 'strikeOut', 'caughtStealing',
      // 'sacrifice'
      kind: null,
      // true when the out closes out a half inning
      isLastOfHalfInning: null,
      // how many runs were scored on the play
      runsScored: 0,
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

const analyzeGameEvent = (eventData) => {
  if (!eventData) { return null }

  initAnalysis(eventData);

  steals.check(analysis, eventData);

  if(gameStatus.check(analysis, eventData)) {
    return analysis;
  }

  if (outs.check(analysis, eventData)) {
    return analysis;
  }

  if (hits.check(analysis, eventData)) {
    return analysis;
  }

  if (walks.check(analysis, eventData)) {
    return analysis;
  }

  return analysis;
};

module.exports = {
  analyzeGameEvent
};

