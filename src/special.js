const util = require('./util');

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
    analysis.specialMeta.kind = 'consumersAttack';
    // why was owen picklestein attacked in a birds circle event outcome, s14 d
    // 101, flowers vs lift
  }

  if (analysis.specialMeta.kind) {
    analysis.special = true;

    return true;
  }

  return false;
};

module.exports = {
  check,
};

