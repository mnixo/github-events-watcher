import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-card/paper-card';
import { timeAgo } from "../util";

export class GewBaseEvent extends LitElement {
  static get properties() {
    return {
      event: Object,
    };
  }

  constructor() {
    super();
    this.event = null;
  }

  _render({ event }) {
    if (!event) {
      return null;
    }
    return html`
      <style>
        paper-card {
          display: flex;
          margin-bottom: 0.5em;
          padding: 0.5em;
          font-size: 14px;
        }
        .container-details {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .container-details > div {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin: 0.1em 0;
        }
        iron-image {
          border-radius: 4px;
          margin-right: 0.5em;
        }
        a {
          color: inherit;
          text-decoration: inherit;
        }
        a:hover {
          color: -webkit-link;
          text-decoration: underline;
        }
        .mono {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
          font-size: 12px;
          border-radius: 2px;
          background-color: #eee;
          padding: 0 0.2em;
          white-space: pre-wrap;
        }
        .code {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
          font-size: 12px;
          border-radius: 2px;
          color: #eee;
          background-color: #2b2b2b;
          padding: 0.5em;
          margin: 0.5em 0;
          white-space: pre-wrap;
        }
        .bump-left {
          margin-left: 0.2em;
        }
        .bump-right {
          margin-right: 0.2em;
        }
        .italic {
          font-style: italic;
        }
      </style>
      <paper-card>
        <div>
          ${this._renderEventActorAvatar(event)}
        </div>
        <div class="container-details">
          ${this._renderEventActor(event)}
          ${this._renderEventType(event)}
        </div>
      </paper-card>
    `;
  }

  _renderEventActorAvatar(event) {
    if (!event.actor) {
      return null;
    }
    return html`
      <a href="${this._getActorUrl(event.actor)}" target="_blank">
        <iron-image src="${event.actor.avatar_url}" width="48" height="48" sizing="contain"></iron-image>
      </a>
    `;
  }

  _renderEventActor(event) {
    if (!event.actor) {
      return null;
    }
    return html`
      <div>
        <a href="${this._getActorUrl(event.actor)}" target="_blank" class="bump-right">
          ${event.actor.login}
        </a>
        in
        <a href="${this._getRepoUrl(event.repo)}" target="_blank" class="bump-left bump-right">
          <span class="mono">${event.repo.name}</span>
        </a>
        (${this._renderDate(event.created_at)}) 
      </div>
    `;
  }

  _renderEventType(event) {
    return null;
  }

  _renderDate(dateString) {
    return timeAgo(new Date() - new Date(dateString));
  }

  _getActorUrl(actor) {
    return `https://github.com/${actor.login}`;
  }

  _getRepoUrl(repo) {
    return `https://github.com/${repo.name}`;
  }

  _getTagUrl(repo, tag) {
    return `https://github.com/${repo.name}/releases/tag/${tag}`;
  }

  _getBranchUrl(repo, branch) {
    return `https://github.com/${repo.name}/tree/${branch}`;
  }

  _getCommitUrl(repo, commit) {
    return `https://github.com/${repo.name}/commit/${commit.sha}`;
  }
}
window.customElements.define('gew-base-event', GewBaseEvent);
