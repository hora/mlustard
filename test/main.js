const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

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

    it('should return all default analysis values if no event data', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.noData);

      assert.propertyVal(analysis, 'id', undefined);
      assert.propertyVal(analysis, 'gameStatus', null);
      assert.propertyVal(analysis, 'runsScored', 0);
      assert.propertyVal(analysis, 'batterUp', false);
      // outs
      assert.propertyVal(analysis, 'out', false);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', null);
      assert.propertyVal(analysis.outMeta, 'sacrifice', false);
      assert.isObject(analysis.outMeta.sacrificeMeta);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', null);
      // hits
      assert.propertyVal(analysis, 'hit', false);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', null);
      assert.propertyVal(analysis.hitMeta, 'bigBucket', false);
      // steals
      assert.propertyVal(analysis, 'steal', false);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'success', null);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', null);
      // walk
      assert.propertyVal(analysis, 'walk', false);
      // special
      assert.propertyVal(analysis, 'special', false);
      assert.isObject(analysis.specialMeta);
      assert.propertyVal(analysis.specialMeta, 'kind', null);
      // base runners
      assert.isObject(analysis.baseRunners);
      assert.isObject(analysis.baseRunners.first);
      assert.isObject(analysis.baseRunners.second);
      assert.isObject(analysis.baseRunners.third);
      assert.isObject(analysis.baseRunners.fourth);
      // maximum blaseball
      assert.propertyVal(analysis, 'maximumBlaseball', false);

    });

    it('should have an id prop, matching the game event id', () => {
      for (const gameId in gameEvents) {
        const gameEvent = gameEvents[gameId];
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        if (gameEvent.id) {
          assert.propertyVal(analysis, 'id', gameEvent.id);
        } else if (gameEvent._id) {
          assert.propertyVal(analysis, 'id', gameEvent._id);
        } else {
          assert(true, false);
        }
      }
    });

  });
});
