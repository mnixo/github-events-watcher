import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-spinner/paper-spinner';
import '@polymer/paper-tooltip/paper-tooltip';

class GEWAuthenticator extends LitElement {
  static get properties() {
    return {
      _secret: String,
      _user: String,
    };
  }

  constructor() {
    super();
    this._secret = null;
    this._user = null;
  }

  _render({ _user }) {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        paper-dialog {
          display: flex;
          flex-direction: column;
        }
        paper-dialog div {
          display: flex;
          flex-direction: column;
          margin: 0;
        }
        .dialog-header {
          padding: 0 2em;
          background-color: #eee;
        }
        .dialog-content {
          padding: 2em;
        }
        paper-dialog paper-button {
          margin-top: 1em;
          padding: 0.7em 0.57em;
        }
        paper-button {
          text-transform: none;
          margin: 0;
        }
        paper-spinner {
          align-self: center;
        }
        .authenticated {
          background-color: var(--google-green-100);
        }
        .authenticated:hover {
          background-color: var(--google-red-100);
        }
        .not-authenticated {
          background-color: #fff;
        }
        .not-authenticated:hover {
          background-color: var(--google-green-100);
        }
      </style>
      
      <paper-dialog id="basic" with-backdrop>
        <div class="dialog-header">
          <h3>GitHub Authentication</h3>
        </div>
        <div class="dialog-content">
          <paper-input id="inputUsername" label="Username"></paper-input>
          <paper-input id="inputPassword" label="Password" type="password"></paper-input>
          <paper-button raised dialog-confirm on-click="${() => this._onBasicConfirm()}">
            Authenticate
          </paper-button>
          <paper-button raised dialog-confirm on-click="${() => this._openDialog('token')}">
            I want to use a Token
          </paper-button>
        </div>
      </paper-dialog>
      
      <paper-dialog id="token" with-backdrop>
        <div class="dialog-header">
          <h3>GitHub Token Authentication</h3>
        </div>
        <div class="dialog-content">
          <paper-input id="inputToken" label="Token"></paper-input>
          <paper-button raised dialog-confirm on-click="${() => this._onTokenConfirm()}">
            Authenticate
          </paper-button>
        </div>
      </paper-dialog>
      
      <paper-dialog id="progress" modal>
        <div class="dialog-header">
          <h3>Authenticating...</h3>
        </div>
        <div class="dialog-content">
          <paper-spinner active></paper-spinner>
        </div>
      </paper-dialog>
      
      <paper-dialog id="error" with-backdrop>
        <div class="dialog-header">
          <h3>Authentication Failed</h3>
        </div>
        <div id="errorContent" class="dialog-content"></div>
      </paper-dialog>
       
      <paper-tooltip animation-delay="0">${this._getButtonTooltip(_user)}</paper-tooltip>
      <paper-button raised on-click="${() => this._onButtonClick()}" class$="${this._getButtonClass(_user)}">
        <iron-icon icon="account-circle"></iron-icon>
      </paper-buttonraised>
    `;
  }

  _getButtonClass(user) {
    return user ? 'authenticated' : 'not-authenticated';
  }

  _getButtonLabel(user) {
    return user ? user : 'Authenticate';
  }

  _getButtonTooltip(user) {
    return user ? `Authenticated as ${user}. Click to logout.` : 'Authenticate with a GitHub account.';
  }

  _onButtonClick() {
    if (this._user) {
      this._user = null;
    } else {
      this._openDialog('basic');
    }
  }

  _openDialog(id) {
    if (id === 'basic') {
      this.shadowRoot.getElementById('inputUsername').value = '';
      this.shadowRoot.getElementById('inputPassword').value = '';
    } else if (id === 'token') {
      this.shadowRoot.getElementById('inputToken').value = '';
    }
    this.shadowRoot.getElementById(id).open();
  }

  _onBasicConfirm() {
    const username = this.shadowRoot.getElementById('inputUsername').value;
    const password = this.shadowRoot.getElementById('inputPassword').value;
    const secret = btoa(`${username}:${password}`);
    this._secret = `Basic ${secret}`;
    this._testAuth();
  }

  _onTokenConfirm() {
    const token = this.shadowRoot.getElementById('inputToken').value;
    this._secret = `token ${token}`;
    this._testAuth();
  }

  _testAuth() {
    this._openDialog('progress');
    const onSuccess = req => {
      this.shadowRoot.getElementById('progress').close();
      this._user = JSON.parse(req.response).login;
    };
    const onError = req => {
      this.shadowRoot.getElementById('progress').close();
      const message = `${req.statusText} (${req.status})\n${JSON.parse(req.response).message}`;
      this.shadowRoot.getElementById('errorContent').innerText = message;
      this._openDialog('error');
      this._user = null;
    };
    this._httpGet('https://api.github.com/user', this._secret, onSuccess, onError);
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
window.customElements.define('gew-authenticator', GEWAuthenticator);