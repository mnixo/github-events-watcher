import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-input/paper-input';

class GEWAuthenticator extends LitElement {
  static get properties() {
    return {

    };
  }

  constructor() {
    super();
  }

  _render(props) {
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
          padding: 0 2em 2em 2em;
        }
        paper-dialog paper-button {
          margin-top: 1em;
          padding: 0.7em 0.57em;
        }
        paper-button {
          text-transform: none;
          margin: 0;
        }       
      </style>
      
      <paper-dialog id="dialogBasic" with-backdrop>
        <div class="dialog-header">
          <h3>GitHub Authentication</h3>
        </div>
        <div class="dialog-content">
          <paper-input id="inputUsername" label="Username"></paper-input>
          <paper-input id="inputPassword" label="Password" type="password"></paper-input>
          <paper-button raised dialog-confirm>Authenticate</paper-button>
          <paper-button raised dialog-confirm on-click="${() => this._openDialogToken()}">
            I want to use a Token
          </paper-button>
        </div>
      </paper-dialog>
      
      <paper-dialog id="dialogToken" with-backdrop>
        <div class="dialog-header">
          <h3>GitHub Token Authentication</h3>
        </div>
        <div class="dialog-content">
          <paper-input id="inputToken" label="Token"></paper-input>
          <paper-button raised dialog-confirm>Authenticate</paper-button>
        </div>
      </paper-dialog>
      
      <paper-button raised on-click="${() => this._openDialogBasic()}">Authenticator</paper-buttonraised>
    `;
  }

  _openDialogBasic() {
    this.shadowRoot.getElementById('dialogBasic').open();
  }

  _openDialogToken() {
    this.shadowRoot.getElementById('dialogToken').open();
  }

}
window.customElements.define('gew-authenticator', GEWAuthenticator);