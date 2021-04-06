"use strict";

var getUpdateText = function getUpdateText(eventData) {
  var _eventData$lastUpdate;

  return (eventData === null || eventData === void 0 ? void 0 : (_eventData$lastUpdate = eventData.lastUpdate) === null || _eventData$lastUpdate === void 0 ? void 0 : _eventData$lastUpdate.toLowerCase()) || '';
};

module.exports = {
  getUpdateText: getUpdateText
};