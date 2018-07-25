import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewIssuesEvent extends GewBaseEvent {

  _renderEventType(event) {
    const payload = event.payload;
    return html`
      <div>
        <iron-image src="img/octoicons/issue-opened.svg"></iron-image>
        Issue ${payload.action}:
        <a href="${payload.issue.html_url}" target="_blank" class="bump-left">
          <span class="mono">${payload.issue.title}</span>
        </a>
      </div>
    `;
  }
}
window.customElements.define('gew-issues-event', GewIssuesEvent);
