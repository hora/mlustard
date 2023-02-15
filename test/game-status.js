const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const allGameEvents = require('./data/gameEvents.js');
// a bit cursed, but whatevs
const chroniclerOne = allGameEvents.chroniclerOne;
const chroniclerTwo = allGameEvents.chroniclerTwo;

describe('mlustard', () => {
  describe('analyzeGameEvent() for game status', () => {

    it('should return an obj with a gameStatus prop, set to beforeFirstPitch, when it is before the first pitch', () => {
      const beforeFirstPitch = chroniclerOne.beforeFirstPitch;
      const analysis = mlustard.analyzeGameEvent(beforeFirstPitch);

      assert.propertyVal(analysis, 'gameStatus', 'beforeFirstPitch');
    });

    it('should register that the 2nd half of inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.secondHalf);

      assert.propertyVal(analysis, 'gameStatus', 'secondHalfInningStart');
    });

    it('should register that the 1st half of inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.firstHalf);

      assert.propertyVal(analysis, 'gameStatus', 'firstHalfInningStart');
    });

    it('should register game end status', () => {
      const endOld = mlustard.analyzeGameEvent(chroniclerOne.endOld);
      const endNew = mlustard.analyzeGameEvent(chroniclerOne.endNew);

      assert.propertyVal(endOld, 'gameStatus', 'gameEnd');
      assert.propertyVal(endNew, 'gameStatus', 'gameEnd');
    });

    it('should register a ground out, and that the half inning ends', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.lastOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground')
      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

    it('should register before first pitch from chron v2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.beforeFirstPitch);

      assert.propertyVal(analysis, 'gameStatus', 'beforeFirstPitch');
    });

    it('should register that the 2nd half of inning is ending for chron v2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.endSecondHalf);

      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

    it('should register that the 1st half of inning is ending for chron v2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.endFirstHalf);

      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

    it('should register that the game is over for chron v2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.gameOver);

      assert.propertyVal(analysis, 'gameStatus', 'gameEnd');
    });

  });
});
