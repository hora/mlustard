const gameStatus = require('./game-status');
const outs = require('./outs');
const hits = require('./hits');
const steals = require('./steals');
const walks = require('./walks');
const special = require('./special');
const misc = require('./misc');
const baseRunners = require('./base-runners');

/*
 * sets all known (aka implemented) analysis results to their defauls
 * return an object with the props:
 *
 * id: string || undefined
 *   - the game event ID
 *
 * score: boolean
 *   - true when at least one run or unrun is scored on the play
 *
 * runsScored: number
 *   - how many runs were scored on the play
 *
 * unrunsScored: number
 *   - how many unruns were scored on the play
 *
 * batterUp: boolean
 *   - whether a batter just showed up to bat
 *
 * gameStatus: null || string
 *   - will be null or one of:
 *   - beforeFirstPitch, when the first pitch hasn't been thrown yet
 *   - firstHalfInningStart, when the first half of an inning is starting
 *   - secondHalfInningStart, when the second half of an inning is starting
 *   - halfInningEnd, when any half of an inning is ending on the play
 *   - gameEnd, when the game has ended
 *   - inningRewind, when the salmon swim upstream
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
 *     - unspecified (as you sometimes see with sacrifice outs)
 *   - sacrifice: boolean
 *     - true when the out was a sacrifice
 *   - sacrificeMeta: object, with the following props:
 *     - kind: string || null
 *       - will be one of:
 *       - advance
 *       - score
 *   - freeRefill: boolean
 *     - true when batter used their free refill on the play
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
 *     - grandSlam
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
 * walkMeta: object, with the props:
 *   - mindTrick: boolean
 *     - true when the pitches used a mind trick to turn the walk into a
 *       strikeout
 *
 * special: boolean
 *   - true when there was a special event on the play
 * specialMeta: object, with the props:
 *   - kind: null || string
 *     - will be one of:
 *     - bloodrain
 *     - isPartying
 *     - reverb
 *     - birdsCircle
 *     - birdsPecked
 *     - justBirds
 *     - allergicReaction
 *     - incinerated
 *     - becameMagmatic
 *     - feedback
 *     - electricity
 *     - unstable
 *     - flickering
 *     - consumersAttack
 *     - salmon
 *   - details: object, with props depending on the type of event
 *
 * baseRunners: object with the following props, representing bases
 *   - first
 *   - second
 *   - third
 *   - fourth
 *   - if there is a baserunner on the given base, the value for that base
 *     will be an object with the following props:
 *     - playerName
 *     - playerId
 *
 * maximumBlaseball: boolean
 *   - true when we're at MAXIMUM BLASEBALL
 */
const initAnalysis = (eventData) => {
  let chroniclerVersion = 'c1v1';

  if (Object.hasOwn(eventData, 'data')) {
    chroniclerVersion = 'c2v0';
  }
  
  return {
    _chroniclerVersion: chroniclerVersion,
    id: eventData.id || eventData._id || eventData.game_id || '',

    era: '',

    gameStatus: null,
    score: false,
    runsScored: 0,
    unrunsScored: 0,

    batterUp: false,

    out: false,
    outMeta: {
      kind: null,
      sacrifice: false,
      sacrificeMeta: {
        kind: null,
      },
      freeRefill: false,
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
    walkMeta: {
      mindTrick: false,
    },

    special: false,
    specialMeta: {
      kind: null,
    },

    baseRunners: {
      first: {},
      second: {},
      third: {},
      fourth: {},
    },

    maximumBlaseball: false,

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
    special,
    misc,
    baseRunners,
  ];

  for (const checker of checkers) {
    checker.check(analysis, eventData);
  }

  return analysis;
};

module.exports = {
  analyzeGameEvent
};

