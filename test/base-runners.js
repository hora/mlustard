const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

describe('mlustard', () => {
  describe('analyzeGameEvent() for base runners', () => {

    it('should register a runner on first base', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.runnerFirst);

      assert.isObject(analysis.baseRunners.first);
      assert.propertyVal(analysis.baseRunners.first, 'playerName', 'Conrad Vaughan');
      assert.propertyVal(analysis.baseRunners.first, 'playerId', '5dbf11c0-994a-4482-bd1e-99379148ee45');
    });

    it('should register a runner on first base pre s-4', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.runnersPreS4);

      assert.isObject(analysis.baseRunners.first);
      assert.propertyVal(analysis.baseRunners.first, 'playerName', 'Landry Violence');
      assert.propertyVal(analysis.baseRunners.first, 'playerId', 'd74a2473-1f29-40fa-a41e-66fa2281dfca');
    });

    it('should register runners on first and second', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.runners1and2);

      assert.isObject(analysis.baseRunners.first);
      assert.propertyVal(analysis.baseRunners.first, 'playerName', 'Langley Wheeler');
      assert.propertyVal(analysis.baseRunners.first, 'playerId', 'c83f0fe0-44d1-4342-81e8-944bb38f8e23');
      assert.isObject(analysis.baseRunners.second);
      assert.propertyVal(analysis.baseRunners.second, 'playerName', 'Cory Ross');
      assert.propertyVal(analysis.baseRunners.second, 'playerId', '17397256-c28c-4cad-85f2-a21768c66e67');
    });

  });
});
