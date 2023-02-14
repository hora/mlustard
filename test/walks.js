const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const allGameEvents = require('./data/gameEvents.js');
// a bit cursed, but whatevs
const chroniclerOne = allGameEvents.chroniclerOne;
const chroniclerTwo = allGameEvents.chroniclerTwo;

describe('mlustard', () => {
  describe('analyzeGameEvent() for walks', () => {

    it('should register a walk on the play, with no score if there was not one', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.walk);

      assert.propertyVal(analysis, 'walk', true);
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should register a walk on the play, with the score calculated if runners made home', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.walkScores);

      assert.propertyVal(analysis, 'walk', true);
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a walk on the play, and a strike out, thanks to the mind trick', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.mindTrickWalk);

      assert.propertyVal(analysis, 'walk', true);
      assert.propertyVal(analysis.walkMeta, 'mindTrick', true);
      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'strike');
    });

    it('should register walks on these chronicler v2 plays', () => {
      const drawsWalk = mlustard.analyzeGameEvent(chroniclerTwo.drawsWalk);
      const earnsWalk = mlustard.analyzeGameEvent(chroniclerTwo.earnsWalk);

      assert.propertyVal(drawsWalk, 'walk', true, `failing on ${chroniclerTwo.drawsWalk.data.displayText}`);
      assert.propertyVal(earnsWalk, 'walk', true, `failing on ${chroniclerTwo.earnsWalk.data.displayText}`);
    });

    it('should not register a walk just cause Qais Dogwalker is on the play', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.qais);

      assert.propertyVal(analysis, 'walk', false);
    });

  });
});

