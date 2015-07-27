exports = function() {
  'use strict';

  var React = require('react');
  var PlayerControlButtons = require('./control-buttons');
  var PlayerTrack = require('./track');

  var PlayerContainer = React.createClass({
    render: function() {
      /* jshint ignore:start */
      return (
        <div className="player">
          <PlayerTrack/>
          <PlayerControlButtons/>
        </div>
      );
      /* jshint ignore:end */
    }
  });

  return PlayerContainer;
};
