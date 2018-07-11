import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_EVENT_ENDPOINTS = [
  {
    id: 'organizationPrivate',
    label: 'Organization Private Events',
    urlTail: '/users/:user/events/orgs/:org',
    docUrl: 'https://developer.github.com/v3/activity/events/#list-events-for-an-organization',
  },
  {
    id: 'organizationPublic',
    label: 'Organization Public Events',
    urlTail: '/orgs/:org/events',
    docUrl: 'https://developer.github.com/v3/activity/events/#list-public-events-for-an-organization',
  },
];

class GewEndpointSelector extends LitElement {
  static get properties() {
    return {
      _endpoint: Object,
    };
  }

  constructor() {
    super();
    this._endpoint = null;
  }

  _render(props) {
    return html`
      <style>
        paper-dropdown-menu {
          width: 100%;
        }
        a {
          font-family: var(--paper-font-common-base_-_font-family);
          font-size: 14px;
          text-decoration: none;
        }
        .mono {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
          font-size: 12px;
          border-radius: 4px;
          background-color: #eee;
          padding: 0.5em;
          margin-bottom: 0.5em;
        }
      </style>
      <paper-dropdown-menu label="GitHub API Endpoint" on-selected-item-changed="${this._onSelectedChange.bind(this)}">
        <paper-listbox slot="dropdown-content" selected="0">
          <paper-item id="organizationPublic">Public Organization Events</paper-item>
          <paper-item id="organizationPrivate">Private Organization Events</paper-item>
        </paper-listbox>
      </paper-dropdown-menu>
      <div id="urlTail" class="mono"></div>
      <a id="docUrl" target="_blank">Read more about this endpoint</a>
    `;
  }

  _onSelectedChange(e) {
    if (!e.detail.value) {
      return;
    }
    this._endpoint = GITHUB_EVENT_ENDPOINTS.find(endpoint => endpoint.id === e.detail.value.id);
    this.shadowRoot.getElementById('docUrl').href = this._endpoint.docUrl;
    this.shadowRoot.getElementById('urlTail').innerText = this._endpoint.urlTail;
  }

  getSelectedEndpointUrl(org, auth) {
    let tail = this._endpoint.urlTail;
    tail = org ? tail.replace(':org', org) : tail;
    tail = auth ? tail.replace(':user', auth.user.login) : tail;
    return GITHUB_API_BASE + tail;
  }
}
window.customElements.define('gew-endpoint-selector', GewEndpointSelector);
