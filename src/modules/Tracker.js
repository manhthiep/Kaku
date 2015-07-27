exports = function() {
  'use strict';
  
  var ua = require('universal-analytics');
  var Constants = require('./Constants');
  var visitor = ua(Constants.GA.RESOURCE_KEY);

  return visitor;
};
