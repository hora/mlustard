const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

describe('mlustard', () => {
  describe('analyzeGameEvent() for outs', () => {

    it('should register an out on the play', () => {
      const outs = [
        gameEvents.flyout,
        gameEvents.groundOut,
        gameEvents.strikeOut,
        gameEvents.sacrificeScore,
        gameEvents.sacrificeAdvance,
      ];

      for (const out of outs) {
        const analysis = mlustard.analyzeGameEvent(out);

        assert.propertyVal(analysis, 'out', true);
        assert.isObject(analysis.outMeta);
      }
    });

    it('should return an obj with a kind prop, set to the string strikeOut, when the play results in a strike out', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.strikeOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'strike');
    });

    it('should register a ground out, and that the half inning ends', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.lastOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground')
      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

    it('should register a player was caught stealing, with an out on the play', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.caughtStealing);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'success', false);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', 2);
      assert.propertyVal(analysis, 'runsScored', 0);
      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'caughtStealing');
    });

    it('should register a sacrifice as an out', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.sacrificeScore);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'unspecified');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.isObject(analysis.outMeta.sacrificeMeta);
    });

    it('should register a sacrifice as an out, counting a run scored', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.sacrificeScore);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'unspecified');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.isObject(analysis.outMeta.sacrificeMeta);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', 'score');
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a sacrifice as an out, with a run scored', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.sacrificeAdvance);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', 'advance');
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a sacrifice as an out, with 1.5 runs scored', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.sacrificeDecimalScore);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', 'advance');
      assert.propertyVal(analysis, 'runsScored', 1.5);
    });

    it('should register an out as fielders choice', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.fieldersChoice);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'fieldersChoice');
      assert.propertyVal(analysis, 'runsScored', 0);
      assert.propertyVal(analysis, 'gameStatus', null);
    });

    it('should register a double play as an out', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.doublePlay);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'doublePlay');
      assert.propertyVal(analysis, 'runsScored', 0);
      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

    it('should count unruns on a triple threat strikeout', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.coffeeUnruns);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'strike');
      assert.propertyVal(analysis, 'unrunsScored', 0.3);
    });

    it('should register a refilled out on the play', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.freeRefill);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground');
      assert.propertyVal(analysis.outMeta, 'freeRefill', true);
      assert.propertyVal(analysis, 'runsScored', 1);
    });

  });
});

