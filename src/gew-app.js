import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-styles/paper-styles';

class GEWApp extends LitElement {
  static get properties() {
    return {
      _auth: String,
      _user: Object,
      _rateLimit: Object,
      _organization: Object,
      _organizationEvents: Object,
    };
  }

  constructor() {
    super();
    this._auth = null;
    this._user = {};
    this._rateLimit = {};
    this._organization = {};
    this._organizationEvents = {};
  }

  _render({ _user, _rateLimit, _organization, _organizationEvents }) {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        paper-card {
          padding: 0.5em;
          margin-bottom: 0.5em;
        }
        paper-button {
          margin: 0;
          width: 100%;
          text-transform: none;
        }
        .console {
          white-space: pre-wrap;
          font-family: monospace;
          background-color: #2b2b2b;
          color: #a9b7c6;
          border-radius: 2px;
          padding: 0.5em;
          margin-bottom: 0.5em;
        }
      </style>
      <paper-card>
        <h3>GitHub Events Watcher</h3>
      </paper-card>
      <paper-card>
        <paper-input id="inputUsername" label="Username"></paper-input>
        <paper-input id="inputPassword" label="Password" type="password"></paper-input>
        <paper-button raised on-click="${() => this._onAuthenticateBasic()}">Use Basic Authentication</paper-button>
      </paper-card>
      <paper-card>
        <paper-input id="inputToken" label="Token"></paper-input>
        <paper-button raised on-click="${() => this._onAuthenticateToken()}">Use Token Authentication</paper-button>
      </paper-card>
      <paper-card>
        <div class="console">${JSON.stringify(_user, null, 2)}</div>
        <paper-button raised on-click="${() => this._onGetUser()}">Get User</paper-button>
      </paper-card>
      <paper-card>
        <div class="console">${JSON.stringify(_rateLimit, null, 2)}</div>
        <paper-button raised on-click="${() => this._onGetRateLimit()}">Get Rate Limit</paper-button>
      </paper-card>
      <paper-card>
        <paper-input id="inputOrganization" label="Organization" value="nuxeo"></paper-input>
      </paper-card>
      <paper-card>
        <div class="console">${JSON.stringify(_organization, null, 2)}</div>
        <paper-button raised on-click="${() => this._onGetOrganization()}">Get Organization</paper-button>
      </paper-card>
      <paper-card>
        <div class="console">${JSON.stringify(_organizationEvents, null, 2)}</div>
        <paper-button raised on-click="${() => this._onGetOrganizationEvents()}">Get Organization Events</paper-button>
      </paper-card>
    `;
  }

  _getOrganization() {
    return this.shadowRoot.getElementById('inputOrganization').value;
  }

  _httpGet(url, callback) {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-type', 'application/json');
    if (this._auth) {
      req.setRequestHeader('Authorization', this._auth);
    }
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        callback(req);
      }
    };
    req.send();
  }

  _onAuthenticateBasic() {
    const username = this.shadowRoot.getElementById('inputUsername').value;
    const password = this.shadowRoot.getElementById('inputPassword').value;
    const secret = btoa(`${username}:${password}`);
    this._auth = `Basic ${secret}`;
  }

  _onAuthenticateToken() {
    const token = this.shadowRoot.getElementById('inputToken').value;
    this._auth = `token ${token}`;
  }

  _onGetUser() {
    this._httpGet('https://api.github.com/user', req => {
      this._user = JSON.parse(req.responseText);
    });
  }

  _onGetRateLimit() {
    this._httpGet('https://api.github.com/rate_limit', req => {
      this._rateLimit = JSON.parse(req.responseText);
    });
  }

  _onGetOrganization() {
    this._httpGet(`https://api.github.com/orgs/${this._getOrganization()}`, req => {
      this._organization = JSON.parse(req.responseText);
    });
  }

  _onGetOrganizationEvents() {
    this._httpGet(`https://api.github.com/orgs/${this._getOrganization()}/events`, req => {
      this._organizationEvents = JSON.parse(req.responseText);
    });
  }

}
window.customElements.define('gew-app', GEWApp);