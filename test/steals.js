const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

describe('mlustard', () => {
  describe('analyzeGameEvent() for steals', () => {

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

    it('should register a successful steal', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealScore);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'success', true);
    });

    it('should register a steal, with runs scored if last base stolen', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealScore);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'success', true);
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should register a steal of fourth base', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealScore);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', 3);
    });

    it('should register a steal, with no runs scored if last base not stolen', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealSecond);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', 1);
      assert.propertyVal(analysis.stealMeta, 'success', true);
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should register a steal of home, with a score of 1', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.stealHome);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', 3);
      assert.propertyVal(analysis, 'runsScored', 1);
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

    it('should register a successful steal, with a blaserunning score on the play pre s12', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.blaserunningOld);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'success', true);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', 1);
      assert.propertyVal(analysis, 'runsScored', 0.2);
    });

    it('should register a successful steal, with a blaserunning score on the play post s12', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.blaserunning);

      assert.propertyVal(analysis, 'steal', true);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'success', true);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', 2);
      assert.propertyVal(analysis, 'runsScored', 0.7);
    });
  });
});

