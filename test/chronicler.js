const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const allGameEvents = require('./data/gameEvents.js');
// a bit cursed, but whatevs
const chroniclerOne = allGameEvents.chroniclerOne;
const chroniclerTwo = allGameEvents.chroniclerTwo;

const CHRONICLER_URL = 'https://api2.sibr.dev/chronicler/v0/game-events?count=100';

describe('mlustard', () => {
  describe('analyzeGameEvent() with latest chronicler data', () => {
    let latestGameEvents;

    before(async function() {
      const response = await fetch(CHRONICLER_URL);

      if (!response.ok) {
        throw new Error("Problem fetching data");
      }

      const data = await response.json();

      latestGameEvents = data.items;
    });

    it('should return an object', () => {
      for (const gameEvent of latestGameEvents) {
        assert.isObject(mlustard.analyzeGameEvent(gameEvent));
      }
    });

    it('should have an id prop', () => {
      for (const gameEvent of latestGameEvents) {
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        assert.property(analysis, 'id');
      }
    });

  });

  describe('analyzeGameEvent() for chronicler versions', () => {
    it('should identify a chronicler v1 game event', () => {
      for (const gameId in chroniclerOne) {
        const gameEvent = chroniclerOne[gameId];
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        assert.propertyVal(analysis, '_chroniclerVersion', 'c1v1');
      }
    });

    it('should identify a chronicler 2 v0 game event', () => {
      for (const gameId in chroniclerTwo) {
        const gameEvent = chroniclerTwo[gameId];
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        assert.propertyVal(analysis, '_chroniclerVersion', 'c2v0');
      }
    });

  });
});

