// 3rd lib
let React = require('react');
let $ = require('jquery');

// NOTE:
// please check https://github.com/atom/electron/issues/254
window.$ = window.jQuery = $;

let Bootstrap = require('bootstrap');
let shell = require('shell');
let remote = require('remote');
let dialog = remote.require('dialog');
let App = remote.require('app');

// modules
let PreferenceManager = require('../modules/PreferenceManager');
let PlaylistManager = require('../modules/PlaylistManager');
let L10nManager = require('../modules/L10nManager');
let KakuCore = require('../modules/KakuCore');
let Searcher = require('../modules/Searcher');
let AutoUpdater = require('../modules/AutoUpdater');
let Tracker = require('../modules/Tracker');

// views
let ToolbarContainer = require('./components/toolbar/container');
let TopRankingContainer = require('./components/topranking/container');
let AllTracksContainer = require('./components/alltracks/container');
let PlayerContainer = require('./components/player/container');
let MenusContainer = require('./components/menus/container');
let HistoryContainer = require('./components/history/container');
let PlaylistContainer = require('./components/playlist/container');
let SettingsContainer = require('./components/settings/container');
let AboutContainer = require('./components/about/container');
let ConnectionCheckContainer =
  require('./components/connection-check/container');

// views/modules
let TabManager = require('./modules/TabManager');
let KonamiCodeManager = require('./modules/KonamiCodeManager');
let EasterEggs = require('./modules/EasterEggs');

let loadingPageDOM = document.querySelector('.loading-page');
let contentPageDOM = document.querySelector('.content-page');

let KakuApp = React.createClass({
  componentWillMount: function() {
    this._hideLoadingPage();
  },

  componentDidMount: function() {
    this._triggerAutoUpdater();
    this._initializeAppTitle();
    this._initializeDefaultLanguage();
    this._initializeDefaultSearcher();
    this._initializeKonamiCode();

    // Say hi :)
    Tracker.pageview('/').send();
  },

  _initializeAppTitle: function() {
    L10nManager.get('app_title_normal').then((translatedTitle) => {
      KakuCore.title = translatedTitle;
    });
  },

  _initializeDefaultLanguage: function() {
    let defaultLanguage =
      PreferenceManager.getPreference('default.language');
    // For new users, there is no `defaultLanguage` in DB yet.
    if (defaultLanguage) {
      L10nManager.changeLanguage(defaultLanguage);
    }
  },

  _initializeDefaultSearcher: function() {
    let defaultSearcher =
      PreferenceManager.getPreference('default.searcher');
    Searcher.changeSearcher(defaultSearcher);
  },

  _initializeKonamiCode: function() {
    KonamiCodeManager.attach(document.body, () => {
      EasterEggs.show();
    });
  },

  _triggerAutoUpdater: function() {
    AutoUpdater.checkUpdate().then((result) => {
      if (result.isNewer) {
        let release = result.release;
        // TODO
        // Need l10n here
        dialog.showMessageBox({
          type: 'info',
          title: 'New release',
          message:
            'Detect a new release version ' + release.version + '\n' +
            'Click ok to download it.',
          detail: release.note,
          buttons: ['ok', 'cancel']
        }, (response) => {
          // means ok
          if (response === 0) {
            let downloadLink = '';
            let platform = process.platform;
            let arch = process.arch;

            if (platform.match(/win32/)) {
              downloadLink = release.download.win.link;
            }
            else if (platform.match(/darwin/)) {
              downloadLink = release.download.mac.link;
            }
            else if (platform.match(/linux/)) {
              if (arch === 'x64') {
                downloadLink = release.download.linux64.link;
              }
              else {
                downloadLink = release.download.linux32.link;
              }
            }

            if (downloadLink) {
              shell.openExternal(downloadLink);
              // a little delay to quit application
              setTimeout(() => {
                App.quit();
              }, 1000);
            }
            else {
              console.log('Cant find download link for the user');
              console.log('platform - ' + platform + ', arch - ', arch);
            }
          }
        });
      }
    });
  },

  _hideLoadingPage: function() {
    // for better UX
    loadingPageDOM.hidden = true;
  },

  render: function() {
    /* jshint ignore:start */
    return (
      <div className="root">
        <ConnectionCheckContainer/>
        <div className="row row-no-padding top-row">
          <div className="col-md-12">
            <div className="toolbar-slot">
              <ToolbarContainer/>
            </div>
          </div>
        </div>
        <div className="row row-no-padding bottom-row">
          <div className="left">
            <div className="sidebar">
              <MenusContainer/>
              <PlayerContainer/>
            </div>
          </div>
          <div className="right">
            <div className="tab-content">
              <div
                role="tabpanel"
                className="tab-pane active"
                id="tab-home">
                  <TopRankingContainer/>
              </div>
              <div
                role="tabpanel"
                className="tab-pane"
                id="tab-search">
                  <AllTracksContainer/>
              </div>
              <div
                role="tabpanel"
                className="tab-pane"
                id="tab-settings">
                  <SettingsContainer/>
              </div>
              <div
                role="tabpanel"
                className="tab-pane"
                id="tab-about">
                  <AboutContainer/>
              </div>
              <div
                role="tabpanel"
                className="tab-pane"
                id="tab-history">
                  <HistoryContainer/>
              </div>
              <div
                role="tabpanel"
                className="tab-pane"
                id="tab-playlist">
                  <PlaylistContainer/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    /* jshint ignore:end */
  }
});

React.render(<KakuApp/>, contentPageDOM);
