const check = (analysis, eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('steal') >= 0
  ) {
    analysis.steal = true;

    if (
      updateText.indexOf('caught') >= 0
    ) {
      analysis.stealMeta.success = false;
      analysis.out = true;
      analysis.outMeta.kind = 'caughtStealing';
    } else {
      analysis.stealMeta.success = true;
    }

    if (
      updateText.search(/steal.*first/) !== -1
    ) {
      analysis.stealMeta.baseStolen = 0;
    } else if (
      updateText.search(/steal.*second/) !== -1
    ) {
      analysis.stealMeta.baseStolen = 1;
    } else if (
      updateText.search(/steal.*third/) !== -1
    ) {
      analysis.stealMeta.baseStolen = 2;
    } else if (
      updateText.search(/steal.*fourth/) !== -1
    ) {
      analysis.stealMeta.baseStolen = 3;

      // this may have been a run if there are 4 bases in play
      if (
        analysis.stealMeta.success &&
        eventData.homeBatter !== null &&
        eventData.awayBases === 4
      ) {
        analysis.runsScored = 1;
      } else if (
        analysis.stealMeta.success &&
        eventData.awayBatter !== null &&
        eventData.homeBases === 4
      ) {
        analysis.runsScored = 1;
      }

    } else if (
      updateText.search(/steal.*home/) !== -1
    ) {

      // see if home or away stole the base
      if (eventData.homeBatter !== null) {
        analysis.stealMeta.baseStolen = eventData.awayBases - 1 || 3;
      } else if (eventData.awaBatter !== null) {
        analysis.stealMeta.baseStolen = eventData.homeBases - 1 || 3;
      } else {
        // older games don't have these fields, or may have both
        // home and away batters filled in; just assumed home base
        // is base #3 in those cases, i guess
        analysis.stealMeta.baseStolen = 3;
      }

      analysis.runsScored = 1;
    }
  }

};

module.exports = {
  check,
};

