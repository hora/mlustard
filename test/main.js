const assert = require('chai').assert;
const mlustard = require('../build/mlustard.js');

const gameEvents = require('./data/gameEvents.js');

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

    it('should return all default analysis values if no event data', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.noData);

      assert.propertyVal(analysis, 'id', undefined);
      assert.propertyVal(analysis, 'gameStatus', null);
      assert.propertyVal(analysis, 'runsScored', 0);
      // outs
      assert.propertyVal(analysis, 'out', false);
      assert.isObject(analysis.outMeta);
      assert.propertyVal(analysis.outMeta, 'kind', null);
      assert.propertyVal(analysis.outMeta, 'sacrifice', false);
      assert.isObject(analysis.outMeta.sacrificeMeta);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', null);
      // hits
      assert.propertyVal(analysis, 'hit', false);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', null);
      assert.propertyVal(analysis.hitMeta, 'bigBucket', false);
      // steals
      assert.propertyVal(analysis, 'steal', false);
      assert.isObject(analysis.stealMeta);
      assert.propertyVal(analysis.stealMeta, 'success', null);
      assert.propertyVal(analysis.stealMeta, 'baseStolen', null);
      // walk
      assert.propertyVal(analysis, 'walk', false);
      // special
      assert.propertyVal(analysis, 'special', false);
      assert.isObject(analysis.specialMeta);
      assert.propertyVal(analysis.specialMeta, 'kind', null);
      // maximum blaseball
      assert.propertyVal(analysis, 'maximumBlaseball', false);

    });

    it('should have an id prop, matching the game event id', () => {
      for (const gameId in gameEvents) {
        const gameEvent = gameEvents[gameId];
        const analysis = mlustard.analyzeGameEvent(gameEvent);

        if (gameEvent.id) {
          assert.propertyVal(analysis, 'id', gameEvent.id);
        } else if (gameEvent._id) {
          assert.propertyVal(analysis, 'id', gameEvent._id);
        } else {
          assert(true, false);
        }
      }
    });

    it('should return an obj with a gameStatus prop, set to beforeFirstPitch, when it is before the first pitch', () => {
      const beforeFirstPitch = gameEvents.beforeFirstPitch;
      const analysis = mlustard.analyzeGameEvent(beforeFirstPitch);

      assert.propertyVal(analysis, 'gameStatus', 'beforeFirstPitch');
    });

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

    it('should register that the 2nd half of inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.secondHalf);

      assert.propertyVal(analysis, 'gameStatus', 'secondHalfInningStart');
    });

    it('should register that the 1st half of inning is starting', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.firstHalf);

      assert.propertyVal(analysis, 'gameStatus', 'firstHalfInningStart');
    });

    it('should register a hit on the play', () => {
      const hits = [
        gameEvents.hit,
        gameEvents.single,
        gameEvents.dbl,
        gameEvents.homeRun,
        gameEvents.bigBucket,
      ];

      const analysis = mlustard.analyzeGameEvent(gameEvents.hit);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
    });

    it('should specify that a single was hit, and count the rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.single);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'single');
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should specify that a double was hit, and count the rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.dbl);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'double');
      assert.propertyVal(analysis, 'runsScored', 1);
    });

    it('should specify that a triple was hit', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.triple);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'triple');
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should specify that a home run was hit, counting all rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.homeRun);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(analysis, 'runsScored', 3);
    });

    it('should specify that a solo home run was hit, counting all rbi pre s12', () => {
      const solo = mlustard.analyzeGameEvent(gameEvents.soloHR);

      assert.propertyVal(solo, 'hit', true);
      assert.isObject(solo.hitMeta);
      assert.propertyVal(solo.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(solo, 'runsScored', 1);
    });

    it('should specify that a 2-run home run was hit, counting all rbi pre s12', () => {
      const twoRun = mlustard.analyzeGameEvent(gameEvents.twoRunHR);

      assert.propertyVal(twoRun, 'hit', true);
      assert.isObject(twoRun.hitMeta);
      assert.propertyVal(twoRun.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(twoRun, 'runsScored', 2);
    });

    it('should specify that a home run landed in a big bucket, counting rbi', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.bigBucket);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'homeRun');
      assert.propertyVal(analysis.hitMeta, 'bigBucket', true);
      assert.propertyVal(analysis, 'runsScored', 3);
    });

    it('should not count score when a hit has no rbi from s12 onwards', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.hitButNoScore);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'single');
      assert.propertyVal(analysis, 'runsScored', 0);
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

    it('should register a sacrifice as an out, with no run scored', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.sacrificeAdvance);

      assert.propertyVal(analysis, 'out', true);
      assert.propertyVal(analysis.outMeta, 'kind', 'ground');
      assert.propertyVal(analysis.outMeta, 'sacrifice', true);
      assert.propertyVal(analysis.outMeta.sacrificeMeta, 'kind', 'advance');
      assert.propertyVal(analysis, 'runsScored', 0);
    });

    it('should register game end status', () => {
      const endOld = mlustard.analyzeGameEvent(gameEvents.endOld);
      const endNew = mlustard.analyzeGameEvent(gameEvents.endNew);

      assert.propertyVal(endOld, 'gameStatus', 'gameEnd');
      assert.propertyVal(endNew, 'gameStatus', 'gameEnd');
    });

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

    it('should register a grand slam', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.grandSlam);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'grandSlam');
      assert.propertyVal(analysis, 'runsScored', 4);
    });

    it('should register a grand slam pre s-12', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.grandSlamPre12);

      assert.propertyVal(analysis, 'hit', true);
      assert.isObject(analysis.hitMeta);
      assert.propertyVal(analysis.hitMeta, 'kind', 'grandSlam');
      assert.propertyVal(analysis, 'runsScored', 4);
    });

    it('should register MAXIMUM BLASEBALL', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.maximumBlaseball);

      assert.propertyVal(analysis, 'maximumBlaseball', true);
    });

    it('should register a salmon event', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.salmon);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'salmon');
    });

    it('should register a defended consumer attack', () => {
      const analysis = mlustard.analyzeGameEvent(gameEvents.consumersDefend);

      assert.propertyVal(analysis, 'special', true);
      assert.propertyVal(analysis.specialMeta, 'kind', 'consumersAttackDefended');
    });

  });
});
