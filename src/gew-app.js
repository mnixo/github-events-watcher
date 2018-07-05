import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-styles/paper-styles';

class GEWApp extends LitElement {
  static get properties() {
    return {
      _rateLimit: Object,
      _organization: Object,
      _organizationEvents: Object,
    };
  }

  constructor() {
    super();
    this._rateLimit = {};
    this._organization = {};
    this._organizationEvents = {};
  }

  _render({ _rateLimit, _organization, _organizationEvents }) {
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
        <div class="console">${JSON.stringify(_rateLimit, null, 2)}</div>
        <paper-button raised on-click="${() => this._onGetRateLimit()}">Get Rate Limit</paper-button>
      </paper-card>
      <paper-card>
        <paper-input id="inputOrganization" label="Organization" value="nuxeo"></paper-input>
        <div class="console">${JSON.stringify(_organization, null, 2)}</div>
        <paper-button raised on-click="${() => this._onGetOrganization()}">Get Organization</paper-button>
      </paper-card>
      <paper-card>
        <paper-input id="inputOrganizationEvents" label="Organization" value="nuxeo"></paper-input>
        <div class="console">${JSON.stringify(_organizationEvents, null, 2)}</div>
        <paper-button raised on-click="${() => this._onGetOrganizationEvents()}">Get Organization Events</paper-button>
      </paper-card>
    `;
  }

  _httpGet(url, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        callback(xhttp);
      }
    };
    xhttp.send();
  }

  _onGetRateLimit() {
    this._httpGet('https://api.github.com/rate_limit', req => {
      this._rateLimit = JSON.parse(req.responseText);
    });
  }

  _onGetOrganization() {
    const organization = this.shadowRoot.getElementById('inputOrganization').value;
    this._httpGet(`https://api.github.com/orgs/${organization}`, req => {
      this._organization = JSON.parse(req.responseText);
    });
  }

  _onGetOrganizationEvents() {
    const organization = this.shadowRoot.getElementById('inputOrganizationEvents').value;
    this._httpGet(`https://api.github.com/orgs/${organization}/events`, req => {
      this._organizationEvents = JSON.parse(req.responseText);
    });
  }

}
window.customElements.define('gew-app', GEWApp);