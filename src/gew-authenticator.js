import '@polymer/iron-icons/iron-icons';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-tooltip/paper-tooltip';
import * as http from './http';

class GEWAuthenticator extends LitElement {
  static get properties() {
    return {
      _user: Object,
      _secret: String,
      authenticatorDialogs: Object,
    };
  }

  constructor() {
    super();
    this._user = null;
    this._secret = null;
    this.authenticatorDialogs = null;
  }

  _render({ _user }) {
    return html`
      <style>
        iron-image {
          border-radius: 4px;
          margin: 8px;
          cursor: pointer;
        }
      </style>
      ${this._renderButton(_user)}   
    `;
  }

  _renderButton(user) {
    if (user) {
      return html`
        <iron-image src="${user.avatar_url}" width="24" height="24" sizing="contain" 
          on-click="${this._onViewProfile.bind(this)}">
        </iron-image>
      `;
    }
    return html`
      <paper-icon-button icon="account-box" on-click="${this._onLogin.bind(this)}"></paper-icon-button>
    `;
  }

  /**
   * Occurs when not authenticated and the login button is clicked.
   * Should clear any previously introduced values and open the basic authentication dialog.
   */
  _onLogin() {
    this.authenticatorDialogs.clear();
    this.authenticatorDialogs.get('basic').open();
  }

  /**
   * Occurs when authenticated and the profile button is clicked.
   * Should open the profile dialog for the authenticated profile.
   */
  _onViewProfile() {
    this.authenticate(this._secret, () => {
      this.authenticatorDialogs.setProfile(this._user);
      this.authenticatorDialogs.get('profile').open();
    });
  }

  /**
   * Given a `user` and a `secret`, stores them and sends a `login` event with these values.
   * This assumes that the `secret` is valid and that it grants access as `user`.
   */
  _saveCredentials(user, secret) {
    this._user = user;
    this._secret = secret;
    this.dispatchEvent(new CustomEvent('login', {
      detail: {
        user,
        secret,
      },
    }));
  }

  /**
   * Clears the currently stored `user` and `secret` information and sends a `logout` event.
   */
  _forgetCredentials() {
    this._user = null;
    this._secret = null;
    this.dispatchEvent(new CustomEvent('logout'));
  }

  /**
   * Tests the authentication using the provided `secret`. If the test is successful:
   * - Stores the `secret` and the `user`.
   * - If an `onAuthenticationSuccessful` callback is provided, it is executed.
   */
  authenticate(secret, onAuthenticationSuccessful) {
    const progressDialog = this.authenticatorDialogs.get('progress');
    progressDialog.open();
    const onSuccess = req => {
      progressDialog.close();
      this._saveCredentials(JSON.parse(req.response), secret);
      if (onAuthenticationSuccessful) {
        onAuthenticationSuccessful();
      }
    };
    const onError = req => {
      progressDialog.close();
      this.authenticatorDialogs.setError(req);
      this.authenticatorDialogs.get('error').open();
      this._forgetCredentials();
    };
    http.get('https://api.github.com/user', secret, onSuccess, onError);
  }

  deauthenticate() {
    this._forgetCredentials();
  }
}
window.customElements.define('gew-authenticator', GEWAuthenticator);
