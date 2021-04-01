const assert = require('chai').assert;
const mlustard = require('../src/mlustard.js');

const gameEvents = require('./data/gameEvents.js');

const beforeFirstPitch = gameEvents.beforeFirstPitch;
const outs = [
  gameEvents.flyout,
  gameEvents.groundOut,
  gameEvents.strikeOut,
];

describe('mlustard', () => {
  describe('analyzeGameEvent()', () => {

    it('should return null if no game event data is provided', () => {
      assert.isNull(mlustard.analyzeGameEvent());
    });

    it('should return an object', () => {
      for (const gameId in gameEvents) {
        assert.isObject(mlustard.analyzeGameEvent(gameEvents[gameId]));
      }
    });

    it('should have an id prop, matching the game event id', () => {
      for (const gameId in gameEvents) {
        const gameEvent = gameEvents[gameId];
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        assert.propertyVal(analysis, 'id', gameEvent.id);
      }
    });

    it('should return an obj with a gameStatus prop, set to beforeFirstPitch, when it is before the first pitch', () => {
      const analysis = mlustard.analyzeGameEvent(beforeFirstPitch);

      assert.propertyVal(analysis, 'gameStatus', 'beforeFirstPitch');
    });

    it('should return an obj with an out prop, set to an obj with an isOut prop set to true, when the play results in a flyout/ground out/strike out', () => {
      for (const out of outs) {
        const analysis = mlustard.analyzeGameEvent(out);

        assert.property(analysis, 'out');
        assert.isObject(analysis.out);
        assert.propertyVal(analysis.out, 'isOut', true);
      }
    });

    it('should return an obj with a kind prop, set to the string strikeOut, when the play results in a strike out', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.strikeOut);

      assert.property(analysis, 'out');
      assert.isObject(analysis.out);
      assert.propertyVal(analysis.out, 'kind', 'strikeOut');
    });

    it('should return an obj with a isLastOfHalfInning prop, set to true, when the play results in an out and the half inning comes to an end as a result', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.lastOut);

      assert.property(analysis, 'out');
      assert.isObject(analysis.out);
      assert.propertyVal(analysis.out, 'isLastOfHalfInning',true);
    });

    it('should return an obj with a gameStatus prop set to secondHalfInningStart prop, when the update is to notify that the second half of an inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.secondHalf);

      assert.propertyVal(analysis, 'gameStatus', 'secondHalfInningStart');
    });

    it('should return an obj with a gameStatus prop set to firstHalfInningStart prop, when the update is to notify that the first half of an inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.firstHalf);

      assert.propertyVal(analysis, 'gameStatus', 'firstHalfInningStart');
    });

    it('should return an obj with a hit prop', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.hit);

      assert.property(analysis, 'hit');
      assert.isObject(analysis.hit);
    });

    it('should specify that a single was hit, and count the rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.single);

      assert.property(analysis, 'hit');
      assert.isObject(analysis.hit);
      assert.propertyVal(analysis.hit, 'kind', 'single');
      assert.propertyVal(analysis.hit, 'rbi', 0);
    });

    it('should specify that a double was hit, and count the rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.dbl);

      assert.property(analysis, 'hit');
      assert.isObject(analysis.hit);
      assert.propertyVal(analysis.hit, 'kind', 'double');
      assert.propertyVal(analysis.hit, 'rbi', 1);
    });

    it('should specify that a triple was hit', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.triple);

      assert.property(analysis, 'hit');
      assert.isObject(analysis.hit);
      assert.propertyVal(analysis.hit, 'kind', 'triple');
      assert.propertyVal(analysis.hit, 'rbi', 0);
    });

    it('should specify that a home run was hit, counting all rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.homeRun);

      assert.property(analysis, 'hit');
      assert.isObject(analysis.hit);
      assert.propertyVal(analysis.hit, 'kind', 'homeRun');
      assert.propertyVal(analysis.hit, 'rbi', 3);
    });

    it('should specify that a solo home run was hit, counting all rbi pre s12', () => {
      const solo = mlustard.analyzeGameEvent(gameEvents.soloHR);

      assert.property(solo, 'hit');
      assert.isObject(solo.hit);
      assert.propertyVal(solo.hit, 'kind', 'homeRun');
      assert.propertyVal(solo.hit, 'rbi', 1);
    });

    it('should specify that a 2-run home run was hit, counting all rbi pre s12', () => {
      const twoRun = mlustard.analyzeGameEvent(gameEvents.twoRunHR);

      assert.property(twoRun, 'hit');
      assert.isObject(twoRun.hit);
      assert.propertyVal(twoRun.hit, 'kind', 'homeRun');
      assert.propertyVal(twoRun.hit, 'rbi', 2);
    });

    it('should specify that a home run landed in a big bucket, counting rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.bigBucket);

      assert.property(analysis, 'hit');
      assert.isObject(analysis.hit);
      assert.propertyVal(analysis.hit, 'kind', 'homeRun');
      assert.propertyVal(analysis.hit, 'bigBucket', true);
      assert.propertyVal(analysis.hit, 'rbi', 3);
    });

    it('should not count score when a hit has no rbi from s12 onwards', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.hitButNoScore);

      assert.property(analysis, 'hit');
      assert.isObject(analysis.hit);
      assert.propertyVal(analysis.hit, 'kind', 'single');
      assert.propertyVal(analysis.hit, 'rbi', 0);
    });

    it('should register a successful steal', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealScore);

      assert.property(analysis, 'steal');
      assert.isObject(analysis.steal);
      assert.propertyVal(analysis.steal, 'isSteal', true);
      assert.propertyVal(analysis.steal, 'success', true);
    });

    it('should register a steal, with runs scored if last base stolen', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealScore);

      assert.property(analysis, 'steal');
      assert.isObject(analysis.steal);
      assert.propertyVal(analysis.steal, 'isSteal', true);
      assert.propertyVal(analysis.steal, 'runsScored', 1);
    });

    it('should register a steal of fourth base', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealScore);

      assert.property(analysis, 'steal');
      assert.isObject(analysis.steal);
      assert.propertyVal(analysis.steal, 'isSteal', true);
      assert.propertyVal(analysis.steal, 'baseStolen', 3);
    });

    it('should register a steal, with no runs scored if last base not stolen', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealSecond);

      assert.property(analysis, 'steal');
      assert.isObject(analysis.steal);
      assert.propertyVal(analysis.steal, 'isSteal', true);
      assert.propertyVal(analysis.steal, 'baseStolen', 1);
      assert.propertyVal(analysis.steal, 'runsScored', 0);
    });

    it('should register a steal of home, with a score of 1', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealHome);

      assert.property(analysis, 'steal');
      assert.isObject(analysis.steal);
      assert.propertyVal(analysis.steal, 'isSteal', true);
      assert.propertyVal(analysis.steal, 'baseStolen', 3);
      assert.propertyVal(analysis.steal, 'runsScored', 1);
    });

    it('should register a player was caught stealing, with an out on the play', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.caughtStealing);

      assert.property(analysis, 'steal');
      assert.isObject(analysis.steal);
      assert.propertyVal(analysis.steal, 'isSteal', true);
      assert.propertyVal(analysis.steal, 'success', false);
      assert.propertyVal(analysis.steal, 'baseStolen', 2);
      assert.propertyVal(analysis.steal, 'runsScored', 0);
      assert.property(analysis, 'out');
      assert.isObject(analysis.out);
      assert.propertyVal(analysis.out, 'isOut', true);
      assert.propertyVal(analysis.out, 'kind', 'caughtStealing');
    });

    it('should register a walk on the play, with no score if there was not one', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.walk);

      assert.property(analysis, 'walk');
      assert.isObject(analysis.walk);
      assert.propertyVal(analysis.walk, 'scores', 0);
    });

    it('should register a walk on the play, with the score calculated if runners made home', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.walkScore);

      assert.property(analysis, 'walk');
      assert.isObject(analysis.walk);
      assert.propertyVal(analysis.walk, 'scores', 1);
    });

    // todo: add a test to make sure no errors are thrown on any past game
    // events, starting from the latest season backwards (since new stuff is
    // more likely to break it)

  });
});
