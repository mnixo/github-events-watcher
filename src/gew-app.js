import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/iron-icons/iron-icons';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-styles/paper-styles';
import '@polymer/paper-toggle-button/paper-toggle-button';
import './gew-authenticator';
import './gew-authenticator-dialogs';
import './gew-endpoint-configurator';
import './gew-listing';
import './gew-scheduler';
import './gew-toggle';
import * as http from './http';
import { sendAnalyticsEvent } from "./util";

class GEWApp extends LitElement {
  static get properties() {
    return {
      _auth: Object,
      _events: Array,
      _organization: String,
      _requestInterval: Number,
    };
  }

  constructor() {
    super();
    this._auth = null;
    this._events = [];
    this._organization = 'nuxeo';
    this._requestInterval = 30;
  }

  _render({ _auth, _events, _organization, _requestInterval }) {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        app-header {
          font-family: var(--paper-font-common-base_-_font-family);
          background-color: #2b2b2b;
          color: #eee;
        }
        paper-progress {
          width: 100%;
        }
        app-drawer {
          --app-drawer-content-container: {
            padding: 120px 1em 0 1em; 
          }
          z-index: 1;
        }
      </style>
      
      <gew-scheduler id="scheduler"></gew-scheduler>
      
      <gew-authenticator-dialogs id="authenticatorDialogs"></gew-authenticator-dialogs>
      
      <app-header reveals>
        <app-toolbar>
          <paper-icon-button icon="menu" onclick="${() => this._toggleDrawer()}"></paper-icon-button>
          <div main-title>GitHub Events Watcher</div>
          <gew-toggle on-toggle="${this._onToggle.bind(this)}"></gew-toggle>
          <gew-authenticator id="authenticator"
            on-login="${this._onLogin.bind(this)}" 
            on-logout="${this._onLogout.bind(this)}">
          </gew-authenticator>
        </app-toolbar>
      </app-header>
      <app-drawer id="drawer" swipe-open>
        <gew-endpoint-configurator></gew-endpoint-configurator>
      </app-drawer>
      
      <gew-listing events="${_events}"></gew-listing>
    `;
  }

  _firstRendered() {
    const authenticator = this.shadowRoot.getElementById('authenticator');
    const authenticatorDialogs = this.shadowRoot.getElementById('authenticatorDialogs');
    authenticator.authenticatorDialogs = authenticatorDialogs;
    authenticatorDialogs.authenticator = authenticator;
  }

  _toggleDrawer() {
    this.shadowRoot.getElementById('drawer').toggle();
  }

  _onLogin(e) {
    this._auth = e.detail;
  }

  _onLogout() {
    this._auth = null;
    this._events = [];
  }

  _onToggle(e) {
    const scheduler = this.shadowRoot.getElementById('scheduler');
    if (e.detail.checked) {
      // get the list straight away
      this._getList();
      // set a recursive scheduler callback
      const schedulerCallback = () => {
        this._getList();
        scheduler.startSchedule(schedulerCallback, this._requestInterval);
      };
      // start the scheduler
      scheduler.startSchedule(schedulerCallback, this._requestInterval);
    } else {
      scheduler.stopSchedule();
    }
  }

  _onOrganizationChange() {
    this._organization = this.shadowRoot.getElementById('inputOrganization').value;
  }

  _onRequestIntervalChange() {
    this._requestInterval = parseInt(this.shadowRoot.getElementById('inputRequestInterval').value);
  }

  _getList() {
    const onSuccess = req => {
      this._events = JSON.parse(req.responseText);
    };
    const onError = req => {
      req.type = 'ErrorEvent';
      this._events = [ req ];
    };
    const endpointSelector = this.shadowRoot.getElementById('endpointSelector');
    const url = endpointSelector.getSelectedEndpointUrl(this._organization, this._auth);
    const secret = this._auth ? this._auth.secret : null;
    http.get(url, secret, onSuccess, onError);
    sendAnalyticsEvent('getList', {
      'organization': this._organization,
      'requestInterval': this._requestInterval,
    });
  }
}
window.customElements.define('gew-app', GEWApp);
