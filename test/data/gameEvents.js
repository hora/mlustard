const CHRONICLER_ONE_SOURCES = [
  require('./chronicler1/game-status'),
  require('./chronicler1/hits'),
  require('./chronicler1/outs'),
  require('./chronicler1/special'),
  require('./chronicler1/steals'),
  require('./chronicler1/walks'),
  // the following use game event data declared above so need to be processed
  // last
  require('./chronicler1/base-runners'),
  require('./chronicler1/misc'),
];

const CHRONICLER_TWO_SOURCES = [
  require('./chronicler2/outs'),
  require('./chronicler2/walks'),
  require('./chronicler2/game-status'),
  require('./chronicler2/hits'),
  require('./chronicler2/base-runners'),
  require('./chronicler2/special'),
];

const CHRONICLER_ONE_DATA = {};

for (let source of CHRONICLER_ONE_SOURCES) {
  for (let sourceData in source) {
    if (typeof(source[sourceData]) === 'string') {
      CHRONICLER_ONE_DATA[sourceData] = CHRONICLER_ONE_DATA[source[sourceData]];
    } else {
      CHRONICLER_ONE_DATA[sourceData] = source[sourceData];
    }
  }
}

const CHRONICLER_TWO_DATA = {};

for (let source of CHRONICLER_TWO_SOURCES) {
  for (let sourceData in source) {
    if (typeof(source[sourceData]) === 'string') {
      CHRONICLER_TWO_DATA[sourceData] = CHRONICLER_TWO_DATA[source[sourceData]];
    } else {
      CHRONICLER_TWO_DATA[sourceData] = source[sourceData];
    }
  }
}

const noData = {
};

module.exports = {
  noData,
  chroniclerOne: CHRONICLER_ONE_DATA,
  chroniclerTwo: CHRONICLER_TWO_DATA,
};

