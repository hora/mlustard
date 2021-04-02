const getUpdateText = (eventData) => {
  return eventData.lastUpdate || '';
};

module.exports = {
  getUpdateText,
};

