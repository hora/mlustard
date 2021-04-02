const checkHitRbiPreS12 = (analysis, updateText) => {
  // if a single/double/triple was hit & x runs were scored, it shows up
  // at the end of the updateText as "...! x scores"
  let match = updateText.match(/! (\d+) scores/);

  if (match) {
    analysis.hit.rbi = parseInt(match[1]);
    return;
  }

  // if a solo home run was hit, updateText contains the text "solo home run"
  if (
    updateText.indexOf('solo home run') >= 0
  ) {
    analysis.hit.rbi = 1;
    return;
  }

  // if a multi-run home run was hit, updateText contains the text "x-run home
  // run"
  match = updateText.match(/(\d+)-run home run/);

  if (match) {
    analysis.hit.rbi = parseInt(match[0]);
    return;
  }
};

const check = (analysis, eventData) => {
  const updateText = eventData.lastUpdate || '';

  if (
    updateText.indexOf('hits a Single') >= 0
  ) {
    analysis.hit.kind = 'single';
  } else if (
    updateText.indexOf('hits a Double') >= 0
  ) {
    analysis.hit.kind = 'double';
  } else if (
    updateText.indexOf('hits a Triple') >= 0
  ) {
    analysis.hit.kind = 'triple';
  } else if (
    updateText.indexOf('home run') >= 0
  ) {
    analysis.hit.kind = 'homeRun';

    if (
      updateText.indexOf('ball lands in a Big Bucket') >= 0
    ) {
      analysis.hit.bigBucket = true;
    }
  }

  if (analysis.hit.kind) {
    analysis.hit.isHit = true;

    // from s12 onward, scores on the play are in the scoreUpdate field
    const scoreUpdate = eventData.scoreUpdate;
    if (scoreUpdate) {
      analysis.hit.rbi = parseInt(scoreUpdate.match(/^\d+/)[0]) || 0;

    } else { // s2 - s11: no scoreUpdate, have to deduce from the updateText
      checkHitRbiPreS12(analysis, updateText);
    }

    return true;
  }

  return false;
};

module.exports = {
  check,
};

