const getUpdateText = (eventData) => {
  return eventData?.lastUpdate?.toLowerCase() || '';
};

/*
 * will look through s for a number (supports positive integers & floats),
 * pre is regex to prepend to the regex for numbers
 * post is regex to append to the regex for numbers
 * will return a number or null
 */
const getNumber = (s, pre, post) => {
  let num = null;
  let numRegex = /(\d+(\.\d+)?)/;

  if (!pre) {
    pre = new RegExp('');
  }

  if (!post) {
    post = new RegExp('');
  }

  let regex = new RegExp(pre.source + numRegex.source + post.source);

  const matches = regex[Symbol.match](s);

  if (matches[1]) {
    num = Number(matches[1]) || num;
  }

  return num;

};

/*
 * will look through s for a team name
 * pre is regex to prepend to the regex for the team name
 * post is regex to append to the regex the team name
 * will return 'home' 'away' or ''
 */
const getTeam = (eventData, s, pre, post) => {
  let team = '';
  let teamRegex = /(.*)/;

  if (!pre) {
    pre = new RegExp('');
  }

  if (!post) {
    post = new RegExp('');
  }

  let regex = new RegExp(pre.source + teamRegex.source + post.source);

  const matches = regex[Symbol.match](s);

  if (matches[1]) {
    team = (eventData.homeTeamNickname.toLowerCase() === matches[1]) ? 'home' : 'away';
  }

  return team;
};

module.exports = {
  getUpdateText,
  getNumber,
  getTeam,
};

