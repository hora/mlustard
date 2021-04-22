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
  let numRegex = /((\d+)?(\.\d+)?)/;

  if (!pre) {
    pre = new RegExp('');
  }

  if (!post) {
    post = new RegExp('');
  }

  let regex = new RegExp(pre.source + numRegex.source + post.source);

  const matches = regex[Symbol.match](s);

  if (matches && matches[1]) {
    num = Number(matches[1]) || num;
  }

  return num;

};

/*
 * will look through s for a match between pre and post
 * pre is regex to prepend to the match
 * post is regex to append to the match
 * will return the match, or an empty string
 */
const getMatch = (eventData, s, pre, post) => {
  let matchRegex = /(.*)/;

  if (!pre) {
    pre = new RegExp('');
  }

  if (!post) {
    post = new RegExp('');
  }

  let regex = new RegExp(pre.source + matchRegex.source + post.source);

  const matches = regex[Symbol.match](s);

  if (matches && matches[1]) {
    return matches[1];
  }

  return '';
};


/*
 * will look through s for a team name
 * pre is regex to prepend to the regex for the team name
 * post is regex to append to the regex the team name
 * will return 'home' 'away' or ''
 */
const getTeam = (eventData, s, pre, post) => {
  let team = getMatch(eventData, s, pre, post);

  if (team) {
    team = (eventData.homeTeamNickname.toLowerCase() === team) ? 'home' : 'away';
  }

  return team;
};

const titleCase = (s) => {
  return s.split(' ').map((word) => {
    if (word) {
      return `${word[0].toUpperCase()}${word.slice(1)}`;
    }
  }).join(' ');
};

/*
 * will look through s for a player name
 * pre is regex to prepend to the regex for the team name
 * post is regex to append to the regex the team name
 * will return the player name or ''
 */
const getPlayer = (eventData, s, pre, post) => {
  const player = getMatch(eventData, s, pre, post);

  return titleCase(player);
};

module.exports = {
  getUpdateText,
  getNumber,
  getTeam,
  getPlayer,
};

