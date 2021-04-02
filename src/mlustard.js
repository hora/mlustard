const gameStatus = require('./game-status');
const outs = require('./outs');
const hits = require('./hits');
const steals = require('./steals');
const walks = require('./walks');

/*
 * sets all known (aka implemented) analysis results to their defauls
 * return an object with the props:
 *
 * id: string || undefined
 *   - the game event ID
 *
 * runsScored: number
 *   - how many runs were scored on the play
 *
 * gameStatus: null || string
 *   - will be null or one of:
 *   - beforeFirstPitch, when the first pitch hasn't been thrown yet
 *   - firstHalfInningStart, when the first half of an inning is starting
 *   - secondHalfInningStart, when the second half of an inning is starting
 *   - halfInningEnd, when any half of an inning is ending on the play
 *   - gameEnd, when the game has ended
 *
 * out: boolean
 *   - true when there is an out on the play
 * outMeta: object, with the props:
 *   - kind: null || string
 *     - will be one of:
 *     - fly
 *     - ground
 *     - strike
 *     - caughtStealing
 *     - unspecified (in the case of a sacrifice out)
 *   - sacrifice: boolean
 *     - true when the out was a sacrifice
 *   - sacrificeMeta: object, with the following props:
 *     - kind: string - todo: NOT YET IMPLEMENTED
 *       - will be one of:
 *       - advance
 *       - score
 *
 * hit: boolean
 *   - true when there is a hit on the play
 * hitMeta: object, with the props:
 *   - kind: null || string
 *     - will be one of:
 *     - single
 *     - double
 *     - triple
 *     - homeRun
 *   - bigBucket: boolean
 *     - whether a Big Bucket was activated on the play
 *
 * steal: boolean
 *   - true when there is an attempted steal on the play
 * stealMeta: object, with the props:
 *   - success: boolean
 *     - true when thief not caught, false otherwise
 *   - baseStolen: null || number
 *     - the base which was stolen (0-indexed)
 *
 * walk: boolean
 *   - true when there is a walk on the play
 */
const initAnalysis = (eventData) => {
  return {
    id: eventData.id || eventData._id,

    gameStatus: null,
    runsScored: 0,

    out: false,
    outMeta: {
      kind: null,
      sacrifice: false,
      sacrificeMeta: {
        kind: null,
      },
    },

    hit: false,
    hitMeta: {
      kind: null,
      bigBucket: false,
    },

    steal: false,
    stealMeta: {
      success: null,
      baseStolen: null,
    },

    walk: false,

  };
};

const analyzeGameEvent = (eventData) => {
  if (!eventData) { return null }

  let analysis = initAnalysis(eventData);

  const checkers = [
    gameStatus,
    outs,
    hits,
    walks,
    steals,
  ];

  for (const checker of checkers) {
    checker.check(analysis, eventData);
  }

  return analysis;
};

module.exports = {
  analyzeGameEvent
};

