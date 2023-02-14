const util = require('./util');

const check = (analysis, eventData) => {
  const update = util.getUpdateText(eventData);

  if (
    /(draws|earns) a walk/.test(update)
  ) {
    analysis.walk = true;

    // check if any runs were scored on the play prior to s12
    if (
      !eventData?.scoreUpdate &&
      update.indexOf('scores') >= 0
    ) {
      analysis.runsScored = 1;
    } // otherwise scores captured in src/misc.js

    // check for mind trick shenanigans
    if (
      update.indexOf('uses a mind trick') >= 0
    ) {
      analysis.walkMeta.mindTrick = true;

      if (update.indexOf('strikes out') >= 0) {
        analysis.out = true;
        analysis.outMeta.kind = 'strike';
      }
    }

    return true;
  }

  return false;
};

module.exports = {
  check,
};

