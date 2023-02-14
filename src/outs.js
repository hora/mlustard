const util = require('./util');

const check = (analysis, eventData) => {
  const update = util.getUpdateText(eventData);

  if (
    /fly\s?out/.test(update)
  ) {
    analysis.outMeta.kind = 'fly';
  } else if (
    /ground\s?out/.test(update)
  ) {
    analysis.outMeta.kind = 'ground';
  } else if (
    /strikes.*out/.test(update)
  ) {
    analysis.outMeta.kind = 'strike';
  } else if (
    update.indexOf('fielder\'s choice') >= 0
  ) {
    analysis.outMeta.kind = 'fieldersChoice';
  } else if (
    update.indexOf('a double play') >= 0
  ) {
    analysis.outMeta.kind = 'doublePlay';
  } else if (
    /makes.*catch/.test(update)
  ) {
    analysis.outMeta.kind = 'catch';
  } else if (
    update.indexOf('forced out') >= 0
  ) {
    analysis.outMeta.kind = 'forced';
  } else if (
    update.indexOf('gets the out') >= 0
  ) {
    analysis.outMeta.kind = 'unspecified';
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
      if (!eventData?.scoreUpdate) {
        analysis.runsScored = 1;
      } // otherwise scores are captured in src/misc.js
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

    if (update.indexOf('free refill') >= 0) {
      analysis.outMeta.freeRefill = true;
    }

    if (update.indexOf('uses a mind trick') >= 0) {
      analysis.outMeta.mindTrick = true;
    }

    return true;
  }

  return false;
};

module.exports = {
  check,
};

