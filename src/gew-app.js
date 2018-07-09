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
import './gew-listing';
import './gew-toggle';

class GEWApp extends LitElement {
  static get properties() {
    return {
      _auth: Object,
      _events: Array,
    };
  }

  constructor() {
    super();
    this._auth = null;
    this._events = [];
  }

  _render({ _auth, _events }) {
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
          --app-drawer-width: 400px;
          --app-drawer-content-container: {
            padding: 120px 1em 0 1em; 
          }
        }
      </style>
      
      <gew-authenticator-dialogs id="authenticatorDialogs"></gew-authenticator-dialogs>
      
      <app-header reveals>
        <app-toolbar>
          <paper-icon-button icon="menu" onclick="${() => this._toggleDrawer()}"></paper-icon-button>
          <div main-title>GitHub Events Watcher</div>
          <gew-toggle disabled="${!_auth}"></gew-toggle>
          <gew-authenticator id="authenticator"
            on-login="${this._onLogin.bind(this)}" 
            on-logout="${this._onLogout.bind(this)}">
          </gew-authenticator>
        </app-toolbar>
      </app-header>
      <app-drawer id="drawer" swipe-open>
        <paper-input label="Organization" value="nuxeo"></paper-input>
        <paper-input label="Request interval" value="10"></paper-input>       
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
    this._getList();
  }

  _onLogout() {
    this._auth = null;
  }

  _getList() {
    const onSuccess = req => {
      this._events = JSON.parse(req.responseText);
    };
    const onError = req => {
      console.log('error!');
      console.log(req);
    };
    this._httpGet('https://api.github.com/orgs/nuxeo/events', this._auth, onSuccess, onError);
  }

  _httpGet(url, auth, onSuccess, onError) {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-type', 'application/json');
    if (auth) {
      req.setRequestHeader('Authorization', auth);
    }
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          return onSuccess ? onSuccess(req) : null;
        } else {
          return onError ? onError(req) : null;
        }
      }
    };
    req.send();
  }
}
window.customElements.define('gew-app', GEWApp);
