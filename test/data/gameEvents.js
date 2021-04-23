const GAME_DATA_SOURCES = [
  require('./game-status'),
  require('./hits'),
  require('./outs'),
  require('./special'),
  require('./steals'),
  require('./walks'),
  // the following use game event data declared above so need to be processed
  // last
  require('./base-runners'),
  require('./misc'),
];

const GAME_DATA = {};

for (let source of GAME_DATA_SOURCES) {
  for (let sourceData in source) {
    if (typeof(source[sourceData]) === 'string') {
      GAME_DATA[sourceData] = GAME_DATA[source[sourceData]];
    } else {
      GAME_DATA[sourceData] = source[sourceData];
    }
  }
}

const noData = {
};

module.exports = {
  noData,
  ...GAME_DATA,
};

