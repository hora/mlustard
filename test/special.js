const assert = require('chai').assert;

const mlustard = require('../build/mlustard.js');
const allGameEvents = require('./data/gameEvents.js');
// a bit cursed, but whatevs
const chroniclerOne = allGameEvents.chroniclerOne;
const chroniclerTwo = allGameEvents.chroniclerTwo;

describe('mlustard', () => {
  describe('analyzeGameEvent() for special events', () => {

    it('should register a blooddrain event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.blooddrain);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'blooddrain');
    });

    it('should register a partying event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.partying);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'isPartying');
    });

    it('should register a reverb event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.reverb);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'reverb');
    });

    it('should register a birds pecked event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.birdsPecked);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'birdsPecked');
    });

    it('should register a birds circle event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.birdsCircled);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'birdsCircle');
    });

    it('should register a birds event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.justBirds);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'justBirds');
    });

    it('should register an allergic reaction event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.allergicReaction);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'allergicReaction');
    });

    it('should register an incinerated event (RIV)', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.riv);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'incinerated');
    });

    it('should register a became magmatic event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.magmatic);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'becameMagmatic');
    });

    it('should register a feedback event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.feedback);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'feedback');
    });

    it('should register an electricity event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.zap);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'electricity');
    });

    it('should register an unstable event (it\'s jaylen!)', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.unstable);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'unstable');
    });

    it('should register a flickering event (jaylen again!!)', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.flickering);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'flickering');
    });

    it('should register a consumers attack event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.consumers);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'consumersAttack');
    });

    it('should register a salmon event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.salmon);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
    });

    it('should register a salmon run with no runs scored & inning do-over', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.salmonNoSteal);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
      assert.isUndefined(analysis.specialMeta.details);
      assert.propertyVal(analysis, 'gameStatus', 'inningRewind');
    });

    it('should register a salmon run with runs scored & inning do-over', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.salmonSteal);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
      assert.deepPropertyVal(analysis.specialMeta.details, 'runsStolen', [4]);
      assert.deepPropertyVal(analysis.specialMeta.details, 'runsStolenFrom', ['away']);
      assert.propertyVal(analysis, 'gameStatus', 'inningRewind');
    });

    it('should register a salmon run with runs scored from both teams & inning do-over', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.salmonMultipleSteals);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
      assert.deepPropertyVal(analysis.specialMeta.details, 'runsStolen', [3, 2]);
      assert.deepPropertyVal(analysis.specialMeta.details, 'runsStolenFrom', ['home', 'away']);
      assert.propertyVal(analysis, 'gameStatus', 'inningRewind');
    });

    it('should register a defended consumer attack', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.consumersDefend);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'consumersAttackDefended');
    });

    it('should register overflowing runs from solar panels', ()=> {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.runsOverflowing);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'runsOverflowing');
      assert.propertyVal(analysis.specialMeta.details, 'runsGained', 1.8);
      assert.propertyVal(analysis.specialMeta.details, 'runsOverflowingFor', 'away');
    });

    it('should register runs collected by solar panels', ()=> {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.runsCollected);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'runsCollected');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 1.8);
      assert.propertyVal(analysis.specialMeta.details, 'runsCollectedFrom', 'away');
    });

    it('should register a win from activating sun 2', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.sun2Smiles);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'sun2');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 10);
      assert.propertyVal(analysis.specialMeta.details, 'winSetUpon', 'home');
    });

    it('should register a black hole swallows event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.blackHoleSwallows);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'blackHole');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 10);
      assert.propertyVal(analysis.specialMeta.details, 'winSwallowedFrom', 'home');
    });

    it('should register a black hole steals event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.blackHoleSteals);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'blackHole');
      assert.propertyVal(analysis.specialMeta.details, 'runsCollected', 10);
      assert.propertyVal(analysis.specialMeta.details, 'winSwallowedFrom', 'away');
      assert.propertyVal(analysis.specialMeta.details, 'playerStolen', 'Mira Lemma');
    });

    it('should register a skate trick, safe', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.railSafe);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'grindRail');
      assert.propertyVal(analysis.specialMeta.details, 'player', 'Engine Eberhardt');
      assert.propertyVal(analysis.specialMeta.details, 'grindSuccess', true);
      assert.propertyVal(analysis.specialMeta.details, 'grindTrick', 'Hot Lasagna');
      assert.propertyVal(analysis.specialMeta.details, 'grindScore', 2020);
      assert.propertyVal(analysis.specialMeta.details, 'landTrick', '90210');
      assert.propertyVal(analysis.specialMeta.details, 'landScore', 1928);
      assert.propertyVal(analysis, 'out', false);
    });

    it('should register a skate trick, out', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerOne.railBail);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'grindRail');
      assert.propertyVal(analysis.specialMeta.details, 'player', 'Bauer Zimmerman');
      assert.propertyVal(analysis.specialMeta.details, 'grindSuccess', false);
      assert.propertyVal(analysis.specialMeta.details, 'grindTrick', 'Spacewalk');
      assert.propertyVal(analysis.specialMeta.details, 'grindScore', 1148);
      assert.isUndefined(analysis.specialMeta.details.landTrick);
      assert.isUndefined(analysis.specialMeta.details.landScore);
      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'railBail');
    });

    it('should register a black hole burp', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.burp);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'burp');
    });

    it('should register a can\'t lose event', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.cantLose);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'cantLose');
    });

    it('should register a mage umpire rules in favor', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.mageRule);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'umpireRulesInFavor');
      assert.propertyVal(analysis.specialMeta.details, 'umpire', 'mage');
    });

    it('should register a bard umpire rules in favor', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.bardRule);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'umpireRulesInFavor');
      assert.propertyVal(analysis.specialMeta.details, 'umpire', 'bard');
    });

    it('should register a mage umpire calling an alternate', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.mageAlternate);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'mageUmpireCallsAlternate');
    });

    it('should register a bard umpire cursing', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.bardCurses);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'bardUmpireCurses');
    });

    it('should register a knight umpire swearing', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.knightSwears);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'knightUmpireSwears');
    });

    it('should register a rogue umpire incinerating', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.rogueIncinerates);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'rogueUmpireIncinerates');
    });

    it('should register a parrying an umpire', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.umpireParry);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'umpireEvaded');
      assert.propertyVal(analysis.specialMeta.details, 'evasionType', 'parries');
      assert.propertyVal(analysis.specialMeta.details, 'umpire', 'knight');
    });

    it('should register a dodge an umpire', () => {
      const analysis = mlustard.analyzeGameEvent(chroniclerTwo.umpireDodge);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'umpireEvaded');
      assert.propertyVal(analysis.specialMeta.details, 'evasionType', 'dodges');
      assert.propertyVal(analysis.specialMeta.details, 'umpire', 'bard');
    });

  });
});

