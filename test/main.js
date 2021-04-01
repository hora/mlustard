const assert = require('chai').assert;
const mlustard = require('../src/mlustard.js');

const gameEvents = require('./data/gameEvents.js');

const beforeFirstPitch = gameEvents.beforeFirstPitch;
const outs = [
  gameEvents.flyout,
  gameEvents.groundOut,
  gameEvents.strikeOut,
];

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

    it('should have an id prop, matching the game event id', () => {
      for (const gameId in gameEvents) {
        const gameEvent = gameEvents[gameId];
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        assert.propertyVal(analysis, 'id', gameEvent.id);
      }
    });

    it('should return an obj with a gameStatus prop, set to beforeFirstPitch, when it is before the first pitch', () => {
      const analysis = mlustard.analyzeGameEvent(beforeFirstPitch);

      assert.propertyVal(analysis, 'gameStatus', 'beforeFirstPitch');
    });

    it('should return an obj with an out prop, set to an obj with an isOut prop set to true, when the play results in a flyout/ground out/strike out', () => {
      for (const out of outs) {
        const analysis = mlustard.analyzeGameEvent(out);

        assert.property(analysis, 'out');
        assert.isObject(analysis.out);
        assert.propertyVal(analysis.out, 'isOut', true);
      }
    });

    it('should return an obj with a kind prop, set to the string strikeOut, when the play results in a strike out', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.strikeOut);

      assert.property(analysis, 'out');
      assert.isObject(analysis.out);
      assert.propertyVal(analysis.out, 'kind', 'strikeOut');
    });

    it('should return an obj with a isLastOfHalfInning prop, set to true, when the play results in an out and the half inning comes to an end as a result', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.lastOut);

      assert.property(analysis, 'out');
      assert.isObject(analysis.out);
      assert.propertyVal(analysis.out, 'isLastOfHalfInning',true);
    });

    it('should return an obj with a gameStatus prop set to secondHalfInningStart prop, when the update is to notify that the second half of an inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.secondHalf);

      assert.propertyVal(analysis, 'gameStatus', 'secondHalfInningStart');
    });

    it('should return an obj with a gameStatus prop set to firstHalfInningStart prop, when the update is to notify that the first half of an inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.firstHalf);

      assert.propertyVal(analysis, 'gameStatus', 'firstHalfInningStart');
    });

  });
});
