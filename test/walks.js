const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

describe('mlustard', () => {
  describe('analyzeGameEvent() for walks', () => {

    it('should register a walk on the play, with no score if there was not one', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.walk);

      assert.propertyVal(analysis, 'walk', true);
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should register a walk on the play, with the score calculated if runners made home', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.walkScores);

      assert.propertyVal(analysis, 'walk', true);
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a walk on the play, and a strike out, thanks to the mind trick', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.mindTrickWalk);

      assert.propertyVal(analysis, 'walk', true);
      assert.propertyVal(analysis.walkMeta, 'mindTrick', true);
      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'strike');
    });

  });
});

