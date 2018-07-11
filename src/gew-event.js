import '@polymer/iron-image/iron-image';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-card/paper-card';
import { pluralize, timeAgo } from "./util";

class GewEvent extends LitElement {
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
      return;
    }
    console.log(event);
    return html`
      <style>
        paper-card {
          display: flex;
          margin-bottom: 0.5em;
          padding: 0.5em;
          z-index: -1;
          font-size: 14px;
        }
        iron-image {
          border-radius: 4px;
          margin-right: 0.5em;
        }
        .container-details > div {
          display: flex;
          align-items: center;
          margin: 0.1em 0;
        }
        .italic {
          font-style: italic;
        }
        .mono {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
          font-size: 12px;
          border-radius: 2px;
          background-color: #eee;
          padding: 0 0.2em;
          white-space: pre-wrap;
        }
        .bump-left {
          margin-left: 0.2em;
        }
        .bump-right {
          margin-right: 0.2em;
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
      <iron-image src="${event.actor.avatar_url}" width="48" height="48" sizing="contain"></iron-image>
    `;
  }

  _renderEventActor(event) {
    if (!event.actor) {
      return null;
    }
    return html`
      <div>
        ${event.actor.login} in
        <span class="mono bump-left bump-right">${event.repo.name}</span>
        (${this._renderDate(event.created_at)}) 
      </div>
    `;
  }

  _renderDate(dateString) {
    return timeAgo(new Date() - new Date(dateString));
  }

  _renderEventType(event) {
    const payload = event.payload;
    if (event.type === 'PushEvent') {
      const commits = payload.commits.map(commit => {
        return html`
          <div>${this._handleCommit(commit)}</div>
        `;
      });
      return html`
        <div>
          <iron-image src="img/octoicons/repo-push.svg"></iron-image>
          Pushed ${payload.commits.length} ${pluralize('commit', 'commits', payload.commits.length)} to 
          <span class="mono bump-left">${payload.ref.replace('refs/heads/', '')}</span>
        </div>
        ${commits}
      `;
    } else if (event.type === 'CreateEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/plus.svg"></iron-image>
          Created <span class="mono bump-left">${payload.ref_type}</span> <span class="mono bump-left">${payload.ref}</span>
        </div>
      `;
    } else if (event.type === 'DeleteEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/trashcan.svg"></iron-image>
          Deleted <span class="mono bump-left">${payload.ref_type}</span> <span class="mono bump-left">${payload.ref}</span>
        </div>
      `;
    } else if (event.type === 'IssueCommentEvent'){
      return html`
        <div>
          <iron-image src="img/octoicons/comment.svg"></iron-image>
          Comment on <span class="mono bump-left">${payload.issue.title}</span>
        </div>
        <div class="italic">"${payload.comment.body}"</div>
      `;
    } else if (event.type === 'PullRequestReviewCommentEvent'){
      return html`
        <div>
          <iron-image src="img/octoicons/comment.svg"></iron-image>
          Comment on <span class="mono bump-left">${payload.pull_request.title}</span>
        </div>
        <div class="italic">"${payload.comment.body}"</div>
      `;
    } else if (event.type === 'PullRequestEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/git-pull-request.svg"></iron-image>
          Pull Request ${payload.action}: <span class="mono bump-left">${payload.pull_request.title}</span>
        </div>
      `;
    } else if (event.type === 'ForkEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/repo-forked.svg"></iron-image>
          Forked the repository
        </div>
      `;
    } else if (event.type === 'WatchEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/eye.svg"></iron-image>
          Watching the repository
        </div>
      `;
    } else if (event.type === 'ErrorEvent') {
      return html`
        <div>Error</div>
        <div class="mono">${event.responseText}</div>
      `;
    } else {
      return event.type;
    }
  }

  _handleCommit(commit) {
    const message = commit.message.length > 100 ? `${commit.message.substring(0, 100)}...` : commit.message;
    const sha = commit.sha.substring(0, 7);
    return html`
      <iron-image src="img/octoicons/git-commit.svg"></iron-image>
      <span class="mono bump-right">${sha}</span>
      <span class="mono bump-right bump-left">${message}</span>${commit.author.name}
    `;
  }
}
window.customElements.define('gew-event', GewEvent);
