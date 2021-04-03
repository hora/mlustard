const util = require('./util');

const check = (analysis, eventData) => {
  const update = util.getUpdateText(eventData);

  if (
    update.indexOf('flyout') >= 0
  ) {
    analysis.outMeta.kind = 'fly';
  } else if (
    update.indexOf('ground out') >= 0
  ) {
    analysis.outMeta.kind = 'ground';
  } else if (
    update.indexOf('strikes out') >= 0
  ) {
    analysis.outMeta.kind = 'strike';
  }

  if (
    update.indexOf('sacrifice') >= 0
  ) {
    // this may already be a ground/flyout, or its unspecified
    analysis.outMeta.kind = analysis.outMeta.kind || 'unspecified';

    analysis.outMeta.sacrifice = true;

    // check if someone scored or advanced on the sacrifice
    if (
      update.indexOf('scores') >= 0
    ) {
      analysis.outMeta.sacrificeMeta.kind = 'score';
      analysis.runsScored = 1;
    } else if (
      update.indexOf('advance') >= 0
    ) {
      analysis.outMeta.sacrificeMeta.kind = 'advance';
    }
  }

  if (analysis.outMeta.kind) {
    analysis.out = true;

    if (eventData?.halfInningOuts === 0) {
      analysis.gameStatus = 'halfInningEnd';
    }

    return true;
  }

  return false;
};

module.exports = {
  check,
};

