const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const allGameEvents = require('./data/gameEvents.js');
// a bit cursed, but whatevs
const gameEvents = allGameEvents.chroniclerOne;

describe('mlustard', () => {
  describe('analyzeGameEvent() for misc checks', () => {

    it('should register MAXIMUM BLASEBALL', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.maximumBlaseball);

      assert.propertyVal(analysis, 'maximumBlaseball', true);
    });

    it('should register a batter showing up to bat', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.batter);

      assert.propertyVal(analysis, 'batterUp', true);
    });

    it('should not register a batter showing up to bat if they have been batting for some time', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.batterAlready);

      assert.propertyVal(analysis, 'batterUp', false);
    });

  });
});
