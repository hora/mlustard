const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const allGameEvents = require('./data/gameEvents.js');
// a bit cursed, but whatevs
const chroniclerOne = allGameEvents.chroniclerOne;
const chroniclerTwo = allGameEvents.chroniclerTwo;

describe('mlustard', () => {
  describe('analyzeGameEvent() for misc checks', () => {

    it('should register MAXIMUM BLASEBALL', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.maximumBlaseball);

      assert.propertyVal(analysis, 'maximumBlaseball', true);
    });

    it('should register a batter showing up to bat', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.batter);

      assert.propertyVal(analysis, 'batterUp', true);
    });

    it('should not register a batter showing up to bat if they have been batting for some time', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.batterAlready);

      assert.propertyVal(analysis, 'batterUp', false);
    });

    it('should register a batter up in chron v2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.batterUp);

      assert.propertyVal(analysis, 'batterUp', true);
    });

    it('should register an away team score in chron v2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.awayScore);

      assert.propertyVal(analysis, 'score', true);
    });

    it('should register a home team score in chron v2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.homeScore);

      assert.propertyVal(analysis, 'score', true);
    });

  });
});
