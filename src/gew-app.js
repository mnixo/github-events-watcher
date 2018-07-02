import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-styles/paper-styles';

class GEWApp extends LitElement {
  static get properties() {
    return {

    };
  }

  _render(props) {
    return html`
      <paper-button>GitHub Events Watcher</paper-button>
    `;
  }
}
window.customElements.define('gew-app', GEWApp);