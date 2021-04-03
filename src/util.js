const getUpdateText = (eventData) => {
  return eventData?.lastUpdate?.toLowerCase() || '';
};

module.exports = {
  getUpdateText,
};

