define(function(require) {
  'use strict';

  var React = require('react');
  var PlayerControlButtons = require('components/player/control-buttons');
  var PlayerTrack = require('components/player/track');
  var KakuCore = require('backend/modules/KakuCore');

  var visibleStyle = {
    'display': 'block'
  };

  var hiddenStyle = {
    'display': 'none'
  };

  var fullPlayer = {
    'width': 1015,
    'height': 580,
    'bottom': '0',
    'left': '0',
  };

  var mediumPlayer = {
    'width': 640,
    'height': 480,
    'bottom': '10px',
    'left': '10px'
  };

  var smallPlayer = {
    'width': 260,
    'height': 220,
    'bottom': '0',
    'left': '0'
  };

  var PlayerContainer = React.createClass({

    getInitialState: function(){
      return {
        playerTitle: '',
        playerSize: 'small', 
        windowWidth: window.innerWidth, 
        windowHeight: window.innerHeight
      };
    },

    handleWindowResize: function(e) {
      this.setState({
        windowWidth: window.innerWidth, 
        windowHeight: window.innerHeight
      });
    },

    componentDidMount: function() {
      window.addEventListener('resize', this.handleWindowResize);
      KakuCore.on('playerTrackUpdated', (track) => {
        this.setState({
          playerTitle: track.title
        });
      });
    },

    componentWillUnmount: function() {
      window.removeEventListener('resize', this.handleWindowResize);
    },

    _onExpandButtonClick: function() {
      this.setState({ playerSize: 'full' });
    },

    _onShrinkButtonClick: function() {
      this.setState({ playerSize: 'small' });
    },

    render: function() {
      /* jshint ignore:start */
      fullPlayer.width = this.state.windowWidth;
      fullPlayer.height = this.state.windowHeight - 40;
      return (
        <div id="videoplayer" className="player" 
          style={(this.state.playerSize == 'full') ? fullPlayer : smallPlayer}>
          <PlayerTrack/>
          <PlayerControlButtons/>
          <div className="window-buttons">
            <button
              className="expand-button"
              onClick={this._onExpandButtonClick}
              title="Expand"
              style={(this.state.playerSize == 'full') ? hiddenStyle : visibleStyle}>
                <i className="fa fa-fw fa-expand"></i>
            </button>
            <button
              className="shrink-button"
              onClick={this._onShrinkButtonClick}
              title="Shrink"
              style={(this.state.playerSize == 'small') ? hiddenStyle : visibleStyle}>
                <i className="fa fa-fw fa-compress"></i>
            </button>
          </div>
          <div className="playerTitle">
            <span>{this.state.playerTitle}</span>
          </div>
        </div>
      );
      /* jshint ignore:end */
    }
  });

  return PlayerContainer;
});
