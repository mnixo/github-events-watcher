import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-styles/paper-styles';

class GEWApp extends LitElement {
  static get properties() {
    return {
      _rateLimit: Object,
    };
  }

  constructor() {
    super();
    this._rateLimit = {};
  }

  _render({ _rateLimit }) {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        .console {
          white-space: pre-wrap;
          font-family: monospace;
          background-color: #2b2b2b;
          color: #a9b7c6;
          padding: 0.5em;
        }
      </style>
      <h1>GitHub Events Watcher</h1>
      <div class="console">${JSON.stringify(_rateLimit, null, 2)}</div>
      <paper-button raised on-click="${() => this._onGetRateLimit()}">Get Rate Limit</paper-button>
    `;
  }

  _onGetRateLimit() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://api.github.com/rate_limit', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        this._rateLimit = JSON.parse(xhttp.responseText);
      }
    };
    xhttp.send();
  }
}
window.customElements.define('gew-app', GEWApp);