const util = require('./util');

const checkForUmpireRules = (analysis, update) => {
  const umpMatch = update.match(/a (bard|mage|knight|rogue) umpire rules in [\w\s]+'s favor/);

  if (umpMatch) {
    analysis.specialMeta.kind = 'umpireRulesInFavor';
    analysis.specialMeta.details = {
      umpire: umpMatch[1],
    };
  }
};

const checkForUmpireEvasion = (analysis, update) => {
  const umpMatch = update.match(/(parries|dodges) (a|the) (bard|mage|knight) umpire's/);

  if (umpMatch) {
    analysis.specialMeta.kind = 'umpireEvaded';
    analysis.specialMeta.details = {
      umpire: umpMatch[3],
      evasionType: umpMatch[1],
    };
  }
};

const check = (analysis, eventData) => {
  const update = util.getUpdateText(eventData);

  if (
    update.indexOf('blooddrain') >= 0
  ) {
    analysis.specialMeta.kind = 'blooddrain';
  } else if (
    update.indexOf('is partying') >= 0
  ) {
    analysis.specialMeta.kind = 'isPartying';
  } else if (
    update.indexOf('reverb') >= 0
  ) {
    analysis.specialMeta.kind = 'reverb';
  } else if (
    // this check has to come before birds circle, because the text
    // 'the birds circle' is present in both cases
    update.indexOf('the birds pecked') >= 0
  ) {
    analysis.specialMeta.kind = 'birdsPecked';
  } else if (
    update.indexOf('the birds circle') >= 0
  ) {
    analysis.specialMeta.kind = 'birdsCircle';
  } else if (
    // this is to capture any other non-pecking & non-circling birdiness
    update.indexOf('birds') >= 0
  ) {
    analysis.specialMeta.kind = 'justBirds';
  } else if (
    update.indexOf('had an allergic reaction') >= 0
  ) {
    analysis.specialMeta.kind = 'allergicReaction';
  } else if (
    update.indexOf('rogue umpire incinerated') >= 0
  ) {
    analysis.specialMeta.kind = 'incinerated';
  } else if (
    update.indexOf('became magmatic') >= 0
  ) {
    analysis.specialMeta.kind = 'becameMagmatic';
  } else if (
    update.indexOf('feedback') >= 0 && (
      update.indexOf('reality flickers') >= 0 ||
      update.indexOf('switched teams') >= 0
    )
  ) {
    analysis.specialMeta.kind = 'feedback';
  } else if (
    update.indexOf('the electricity zaps') >= 0
  ) {
    analysis.specialMeta.kind = 'electricity';
  } else if (
      update.indexOf('is now unstable') >= 0
  ) {
    analysis.specialMeta.kind = 'unstable';
  } else if (
    update.indexOf('is now flickering') >= 0
  ) {
    analysis.specialMeta.kind = 'flickering';
  } else if (
    update.indexOf('consumers attack') >= 0
  ) {

    if (
      update.indexOf('defends') >= 0
    ) {
      analysis.specialMeta.kind = 'consumersAttackDefended';
    } else {
      analysis.specialMeta.kind = 'consumersAttack';
    }
  } else if (
    update.indexOf('salmon swim upstream') >= 0
  ) {
    analysis.specialMeta.kind = 'salmon';
    analysis.gameStatus = 'inningRewind';

    // first, grab all the sentences with which team lost how many runs
    const teams = update.match(/(\d+(\.\d+)?) of the .*'s runs are lost/g);

    if (teams) {
      let runsStolen = teams.map((team) => {
        return util.getNumber(team, null, null) || 0;
      });

      let runsStolenFrom = teams.map((team) => {
        return util.getTeam(eventData, team, /of the /, /'s runs/);
      });

      analysis.specialMeta.details = {
        runsStolen,
        runsStolenFrom,
      };
    }

  } else if (
    update.indexOf('runs are overflowing') >= 0
  ) {
    analysis.specialMeta.kind = 'runsOverflowing';

    analysis.specialMeta.details = {
      runsGained: util.getNumber(update, null, / unruns/),
      runsOverflowingFor: util.getTeam(eventData, update, /\n/, / gain/),
    };

  } else if (
    update.indexOf('solar panels absorb') >= 0
  ) {
    analysis.specialMeta.kind = 'runsCollected';

    analysis.specialMeta.details = {
      runsCollected: util.getNumber(update, null, / runs are collected/),
      runsCollectedFrom: util.getTeam(eventData, update, /saved for the /, /'s next game/),
    };

  } else if (
    update.indexOf('sun 2 smiles') >= 0
  ){
    analysis.specialMeta.kind = 'sun2';

    analysis.specialMeta.details = {
      runsCollected: util.getNumber(update, null, /! sun 2 smiles/),
      winSetUpon: util.getTeam(eventData, update, /set a win upon the /, /\./),
    };
  } else if (
    update.indexOf('black hole swallows') >= 0
  ) {
    analysis.specialMeta.kind = 'blackHole';

    analysis.specialMeta.details = {
      runsCollected: util.getNumber(update, /collect /, /!/),
      winSwallowedFrom: util.getTeam(eventData, update, /swallows the runs and a /, / win./),
    };

    // see if carcinization triggered by the black hole
    if (update.indexOf('the baltimore crabs steal') >= 0) {
      analysis.specialMeta.details.playerStolen = util.getPlayer(update, /crabs steal /, / for the remainder/);
    }
  } else if (
    update.indexOf('grind rail') >= 0
  ) {
    analysis.specialMeta.kind = 'grindRail';

    const tricks = util.getSkateTricks(update);

    analysis.specialMeta.details = {
      player: util.getPlayer(update, /^/, / hops on/),
      ...tricks,
    };

    if (update.indexOf('safe!') >= 0) {
      analysis.specialMeta.details = {
        ...analysis.specialMeta.details,
        grindSuccess: true,
      };
    } else { // out!
      analysis.specialMeta.details = {
        ...analysis.specialMeta.details,
        grindSuccess: false,
      };

      analysis.out = true;
      analysis.outMeta.kind = 'railBail';
    }

  } else if (
    update.indexOf('burp') >= 0
  ) {
    analysis.specialMeta.kind = 'burp';
  } else if (
    update.indexOf('can\'t lose! they join') >= 0
  ) {
    analysis.specialMeta.kind = 'cantLose';
  } else if (
    /mage umpire calls [\w\s]+'s alternate/.test(update)
  ) {
    analysis.specialMeta.kind = 'mageUmpireCallsAlternate';
  } else if (
    update.indexOf('bard umpire curses') >= 0
  ) {
    analysis.specialMeta.kind = 'bardUmpireCurses';
  } else if (
    update.indexOf('knight swears at') >= 0
  ) {
    analysis.specialMeta.kind = 'knightUmpireSwears';
  } else if (
    // in previous eras this used to be incinerated (past tense)
    // adding a new special event for backwards compatibility and
    // consistency with how other umpire events are registered
    update.indexOf('rogue umpire incinerates') >= 0
  ) {
    analysis.specialMeta.kind = 'rogueUmpireIncinerates';
  }

  checkForUmpireRules(analysis, update);
  checkForUmpireEvasion(analysis, update);

  // if we found something, then:
  if (analysis.specialMeta.kind) {
    analysis.special = true;

    return true;
  }

  return false;
};

module.exports = {
  check,
};

