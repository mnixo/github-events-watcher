import '@polymer/iron-image/iron-image';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-spinner/paper-spinner';

class GEWAuthenticatorDialogs extends LitElement {
  static get properties() {
    return {
      authenticator: Object,
    };
  }

  constructor() {
    super();
    this.authenticator = null;
  }

  _render(props) {
    return html`
      <style>
        h3 {
          margin: 0;
        }
        .dialog-header, .dialog-content {
          margin: 0;
        }
        .dialog-header {
          padding: 1em 2em;
          background-color: #eee;
        }
        .dialog-content {
          display: flex;
          flex-direction: column;
          padding: 2em;
        }
        .profile-content {
          display: flex;
        }
        .profile-content iron-image {
          margin-right: 1em;
        }
        .profile-row {
          display: flex;
          align-items: center;
        }
        .profile-row iron-icon {
          margin-right: 1em;
        }
        paper-button {
          text-transform: none;
          margin: 1em 0 0 0;
        }
        paper-spinner {
          align-self: center;
        }
      </style>
      
      <paper-dialog id="basic" with-backdrop>
        <div class="dialog-header">
          <h3>GitHub Authentication</h3>
        </div>
        <div class="dialog-content">
          <paper-input id="inputUsername" label="Username"></paper-input>
          <paper-input id="inputPassword" label="Password" type="password"></paper-input>
          <paper-button raised dialog-confirm on-click="${this._onBasicConfirm.bind(this)}">
            Authenticate
          </paper-button>
          <paper-button raised dialog-confirm on-click="${() => this.get('token').open()}">
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
          <paper-button raised dialog-confirm on-click="${this._onTokenConfirm.bind(this)}">
            Authenticate
          </paper-button>
        </div>
      </paper-dialog>
      
      <paper-dialog id="profile" with-backdrop>
        <div class="dialog-header">
          <h3>Authenticated Profile</h3>
        </div>
        <div class="dialog-content">
          <div class="profile-content">
            <iron-image id="profileAvatar" on-loaded-changed="${this._onProfileAvatarLoaded.bind(this)}" width="96" height="96" sizing="contain"></iron-image>
            <div>
              <div id="profileRowId" class="profile-row">
                <iron-icon icon="fingerprint"></iron-icon>
                <div id="profileId"></div>
              </div>
              <div id="profileRowName" class="profile-row">
                <iron-icon icon="account-circle"></iron-icon>
                <div id="profileName"></div>
              </div>
              <div id="profileRowLocation" class="profile-row">
                <iron-icon icon="room"></iron-icon>
                <div id="profileLocation"></div>
              </div>
              <div id="profileRowCompany" class="profile-row">
                <iron-icon icon="work"></iron-icon>
                <div id="profileCompany"></div>
              </div>
            </div>
          </div>
          <paper-button raised dialog-confirm on-click="${this._onLogout.bind(this)}">Log out</paper-button>
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
    `;
  }

  _onBasicConfirm() {
    if (!this.authenticator) {
      return;
    }
    const username = this.get('inputUsername').value;
    const password = this.get('inputPassword').value;
    const secret = btoa(`${username}:${password}`);
    this.authenticator.authenticate(`Basic ${secret}`);
  }

  _onTokenConfirm() {
    if (!this.authenticator) {
      return;
    }
    const token = this.get('inputToken').value;
    this.authenticator.authenticate(`token ${token}`);
  }

  _onLogout() {
    this.authenticator.logout();
  }

  _onProfileAvatarLoaded() {
    this.get('profile').notifyResize();
  }

  get(id) {
    return this.shadowRoot.getElementById(id);
  }

  clear() {
    this.get('inputUsername').value = '';
    this.get('inputPassword').value = '';
    this.get('inputToken').value = '';
  }

  setError(req) {
    this.get('errorContent').innerText = `${req.statusText} (${req.status})\n${JSON.parse(req.response).message}`;
  }

  setProfile(user) {
    this.get('profileId').innerText = user.login;
    this.get('profileName').innerText = user.name;
    this.get('profileRowName').hidden = !user.name;
    this.get('profileLocation').innerText = user.location;
    this.get('profileRowLocation').hidden = !user.location;
    this.get('profileCompany').innerText = user.company;
    this.get('profileRowCompany').hidden = !user.company;
    this.get('profileAvatar').src = user.avatar_url;
  }

}
window.customElements.define('gew-authenticator-dialogs', GEWAuthenticatorDialogs);
