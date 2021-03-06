const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

describe('mlustard', () => {
  describe('analyzeGameEvent() for hits', () => {

    it('should register a hit on the play', () => {
      const hits = [
        gameEvents.hit,
        gameEvents.single,
        gameEvents.dbl,
        gameEvents.homeRun,
        gameEvents.bigBucket,
      ];

      const analysis = mlustard.analyzeGameEvent(gameEvents.hit);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
    });

    it('should specify that a single was hit, and count the rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.single);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'single');
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should specify that a double was hit, and count the rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.dbl);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'double');
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should specify that a triple was hit', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.triple);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'triple');
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should specify that a home run was hit, counting all rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.homeRun);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(analysis, 'runsScored', 3);
    });

    it('should specify that a solo home run was hit, counting all rbi pre s12', () => {
      const solo = mlustard.analyzeGameEvent(gameEvents.soloHR);

      assert.propertyVal(solo, 'hit', true);
      assert.isObject(solo.hitMeta);
      assert.propertyVal(solo.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(solo, 'runsScored', 1);
    });

    it('should specify that a 2-run home run was hit, counting all rbi pre s12', () => {
      const twoRun = mlustard.analyzeGameEvent(gameEvents.twoRunHR);

      assert.propertyVal(twoRun, 'hit', true);
      assert.isObject(twoRun.hitMeta);
      assert.propertyVal(twoRun.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(twoRun, 'runsScored', 2);
    });

    it('should specify that a home run landed in a big bucket, counting rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.bigBucket);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(analysis.hitMeta, 'bigBucket', true);
      assert.propertyVal(analysis, 'runsScored', 3);
    });

    it('should not count score when a hit has no rbi from s12 onwards', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.hitButNoScore);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'single');
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should register a grand slam', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.grandSlam);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'grandSlam');
      assert.propertyVal(analysis, 'runsScored', 4);
    });

    it('should register a grand slam pre s-12', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.grandSlamPre12);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'grandSlam');
      assert.propertyVal(analysis, 'runsScored', 4);
    });

  });
});

