import { LitElement, html } from '@polymer/lit-element';

class GewScheduler extends LitElement {
  static get properties() {
    return {
      _timeOut: Object,
    };
  }

  constructor() {
    super();
    this._timer = null;
  }

  _render(props) {
    return html``;
  }

  startSchedule(callback, seconds) {
    this._timer = setTimeout(callback, seconds * 1000);
  }

  stopSchedule() {
    clearTimeout(this._timer);
    this._timer = null;
  }

}
window.customElements.define('gew-scheduler', GewScheduler);
