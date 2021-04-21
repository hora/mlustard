const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const gameEvents = require('./data/gameEvents.js');

describe('mlustard', () => {
  describe('analyzeGameEvent() for special events', () => {

    it('should register a blooddrain event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.blooddrain);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'blooddrain');
    });

    it('should register a partying event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.partying);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'isPartying');
    });

    it('should register a reverb event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.reverb);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'reverb');
    });

    it('should register a birds pecked event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.birdsPecked);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'birdsPecked');
    });

    it('should register a birds circle event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.birdsCircled);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'birdsCircle');
    });

    it('should register a birds event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.justBirds);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'justBirds');
    });

    it('should register an allergic reaction event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.allergicReaction);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'allergicReaction');
    });

    it('should register an incinerated event (RIV)', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.riv);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'incinerated');
    });

    it('should register a became magmatic event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.magmatic);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'becameMagmatic');
    });

    it('should register a feedback event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.feedback);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'feedback');
    });

    it('should register an electricity event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.zap);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'electricity');
    });

    it('should register an unstable event (it\'s jaylen!)', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.unstable);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'unstable');
    });

    it('should register a flickering event (jaylen again!!)', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.flickering);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'flickering');
    });

    it('should register a consumers attack event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.consumers);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'consumersAttack');
    });

    it('should register a salmon event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.salmon);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
    });

    it('should register a salmon run with no runs scored & inning do-over', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.salmonNoSteal);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
      assert.propertyVal(analysis.specialMeta.details, 'runsStolen', 0);
      assert.propertyVal(analysis.specialMeta.details, 'runsStolenFrom', '');
      assert.propertyVal(analysis, 'gameStatus', 'inningRewind');
    });

    it('should register a salmon run with runs scored & inning do-over', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.salmonSteal);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
      assert.propertyVal(analysis.specialMeta.details, 'runsStolen', 4);
      assert.propertyVal(analysis.specialMeta.details, 'runsStolenFrom', 'away');
      assert.propertyVal(analysis, 'gameStatus', 'inningRewind');
    });

    it('should register a defended consumer attack', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.consumersDefend);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'consumersAttackDefended');
    });

    it('should register overflowing runs from solar panels', ()=> {
      const analysis = mlustard.analyzeGameEvent(gameEvents.runsOverflowing);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'runsOverflowing');
      assert.propertyVal(analysis.specialMeta.details, 'runsGained', 1.8);
      assert.propertyVal(analysis.specialMeta.details, 'runsOverflowingFor', 'away');
    });

    it('should register runs collected by solar panels', ()=> {
      const analysis = mlustard.analyzeGameEvent(gameEvents.runsCollected);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'runsCollected');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 1.8);
      assert.propertyVal(analysis.specialMeta.details, 'runsCollectedFrom', 'away');
    });

    it('should register a win from activating sun 2', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.sun2Smiles);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'sun2');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 10);
      assert.propertyVal(analysis.specialMeta.details, 'winSetUpon', 'home');
    });

    it('should register a black hole swallows event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.blackHoleSwallows);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'blackHole');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 10);
      assert.propertyVal(analysis.specialMeta.details, 'winSwallowedFrom', 'home');
    });

    it('should register a black hole steals event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.blackHoleSteals);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'blackHole');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 10);
      assert.propertyVal(analysis.specialMeta.details, 'winSwallowedFrom', 'away');
      assert.propertyVal(analysis.specialMeta.details, 'playerStolen', 'Mira Lemma');
    });

  });
});

