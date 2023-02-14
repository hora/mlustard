const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const allGameEvents = require('./data/gameEvents.js');
// a bit cursed, but whatevs
const chroniclerOne = allGameEvents.chroniclerOne;
const chroniclerTwo = allGameEvents.chroniclerTwo;

describe('mlustard', () => {
  describe('analyzeGameEvent() for outs', () => {

    it('should register an out on the play for chron v1', () => {
      const outs = [
        chroniclerOne.flyout,
        chroniclerOne.groundOut,
        chroniclerOne.strikeOut,
        chroniclerOne.sacrificeScore,
        chroniclerOne.sacrificeAdvance,
      ];

      for (const out of outs) {
        const analysis = mlustard.analyzeGameEvent(out);

        assert.propertyVal(analysis, 'out', true);
        assert.isObject(analysis.outMeta);
      }
    });

    it('should register an out on the play for chron v2', () => {
      const outs = [
        chroniclerTwo.flyout,
        chroniclerTwo.strikeout,
        chroniclerTwo.catchOut,
        chroniclerTwo.simpleCatch,
        chroniclerTwo.strikesOut,
        chroniclerTwo.groundOut,
        chroniclerTwo.groundOut2,
        chroniclerTwo.forcedOut,
        chroniclerTwo.outAtFirst,
      ];

      for (const out of outs) {
        const analysis = mlustard.analyzeGameEvent(out);

        assert.propertyVal(analysis, 'out', true, `failing on ${out.data.displayText}`);
        assert.isObject(analysis.outMeta);
      }
    });

    it('should return an obj with a kind prop, set to the string strikeOut, when the play results in a strike out', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.strikeOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'strike');
    });

    it('should register a ground out, and that the half inning ends', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.lastOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground')
      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

    it('should register a player was caught stealing, with an out on the play', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.caughtStealing);

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
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.sacrificeScore);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'unspecified');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.isObject(analysis.outMeta.sacrificeMeta);
    });

    it('should register a sacrifice as an out, counting a run scored', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.sacrificeScore);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'unspecified');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.isObject(analysis.outMeta.sacrificeMeta);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', 'score');
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a sacrifice as an out, with a run scored', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.sacrificeAdvance);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', 'advance');
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a sacrifice as an out, with 1.5 runs scored', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.sacrificeDecimalScore);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', 'advance');
      assert.propertyVal(analysis, 'runsScored', 1.5);
    });

    it('should register an out as fielders choice', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.fieldersChoice);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'fieldersChoice');
      assert.propertyVal(analysis, 'runsScored', 0);
      assert.propertyVal(analysis, 'gameStatus', null);
    });

    it('should register a double play as an out', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.doublePlay);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'doublePlay');
      assert.propertyVal(analysis, 'runsScored', 0);
      assert.propertyVal(analysis, 'gameStatus', 'halfInningEnd');
    });

    it('should count unruns on a triple threat strikeout', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.coffeeUnruns);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'strike');
      assert.propertyVal(analysis, 'unrunsScored', 0.3);
    });

    it('should register a refilled out on the play', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.freeRefill);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground');
      assert.propertyVal(analysis.outMeta, 'freeRefill', true);
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a mind trick out on the play', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.mindTrickOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'strike');
      assert.propertyVal(analysis.outMeta, 'mindTrick', true);
    });

    it('should register a catch out', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.catchOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'catch');
    });

    it('should register a catch out', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.simpleCatch);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'catch');
    });

    it('should register a forced out', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.forcedOut);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'forced');
    });

    it('should register an out when it takes place at a base', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.outAtFirst);

      assert.propertyVal(analysis, 'out', true);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', 'unspecified');
    });

    it('should not register a strike when there isn\'t one', () => {
      const STRIKEOUTS = [
        'flyout',
        'groundOut',
        'strikeOut',
        'sacrificeScore',
        'sacrificeAdvance',
        'fieldersChoice',
        'doublePlay',
        'coffeeUnruns',
        'sacrificeDecimalScore',
        'freeRefill',
        'mindTrickOut',
        'lastOut',
        'railBail',
        'caughtStealing',
        'mindTrickWalk',
      ];

      for (const gameId in chroniclerOne) {
        const gameEvent = chroniclerOne[gameId];
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        if (!STRIKEOUTS.includes(gameId)) {
          assert.propertyVal(analysis, 'out', false, `failing on ${gameEvent?.lastUpdate || gameEvent?.data?.displayText}`);
        }
      }
    });

  });
});

