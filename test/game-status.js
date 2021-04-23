const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

describe('mlustard', () => {
  describe('analyzeGameEvent() for game status', () => {

    it('should return an obj with a gameStatus prop, set to beforeFirstPitch, when it is before the first pitch', () => {
      const beforeFirstPitch = gameEvents.beforeFirstPitch;
      const analysis = mlustard.analyzeGameEvent(beforeFirstPitch);

      assert.propertyVal(analysis, 'gameStatus', 'beforeFirstPitch');
    });

    it('should register that the 2nd half of inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.secondHalf);

      assert.propertyVal(analysis, 'gameStatus', 'secondHalfInningStart');
    });

    it('should register that the 1st half of inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.firstHalf);

      assert.propertyVal(analysis, 'gameStatus', 'firstHalfInningStart');
    });

    it('should register game end status', () => {
      const endOld = mlustard.analyzeGameEvent(gameEvents.endOld);
      const endNew = mlustard.analyzeGameEvent(gameEvents.endNew);

      assert.propertyVal(endOld, 'gameStatus', 'gameEnd');
      assert.propertyVal(endNew, 'gameStatus', 'gameEnd');
    });

    it('should register a ground out, and that the half inning ends', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.lastOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground')
      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

  });
});
