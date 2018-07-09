import '@polymer/iron-image/iron-image';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-card/paper-card';

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
          flex-direction: column;
          margin-bottom: 0.5em;
          padding: 0.5em;
          z-index: -1;
          font-size: 14px;
        }
        iron-image {
          border-radius: 4px;
          margin-right: 0.5em;
        }
        paper-card > div {
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
        }
        .bump-left {
          margin-left: 0.2em;
        }
        .bump-right {
          margin-right: 0.2em;
        }
      </style>
      <paper-card>
        <div class="actor">
          <iron-image src="${event.actor.avatar_url}" width="20" height="20" sizing="contain"></iron-image>
          <div>
            ${event.actor.login} in <span class="mono">${event.repo.name}</span> (${this._renderDate(event.created_at)}) 
          </div>
        </div>
        ${this._renderEventType(event)}
      </paper-card>
    `;
  }

  _renderDate(dateString) {
    const delta = new Date() - new Date(dateString);
    if (delta < 1000) {
      return html`now`;
    }
    let deltaSeconds = delta / 1000;
    if (deltaSeconds < 60) {
      deltaSeconds = deltaSeconds.toFixed();
      return html`${deltaSeconds} second${deltaSeconds > 1 ? 's' : ''} ago`;
    }
    let deltaMinutes = deltaSeconds / 60;
    if (deltaMinutes < 60) {
      deltaMinutes = deltaMinutes.toFixed();
      return html`${deltaMinutes} minute${deltaMinutes > 1 ? 's' : ''} ago`;
    }
    let deltaHours = deltaMinutes / 60;
    if (deltaHours < 24) {
      deltaHours = deltaHours.toFixed();
      return html`${deltaHours} hour${deltaHours > 1 ? 's' : ''} ago`;
    }
    const deltaDays = (deltaHours / 24).toFixed();
    return html`${deltaDays} day${deltaDays > 1 ? 's' : ''} ago`;
  }

  _renderEventType(event) {
    const payload = event.payload;
    if (event.type === 'PushEvent') {
      const commits = payload.commits.map(commit => {
        return html`
          <div>
            -<span class="mono bump-left bump-right">${commit.message}</span>${commit.author.name}
          </div>
        `;
      });
      return html`
        <div>
          Pushed ${payload.commits.length} commit(s) to <span class="mono bump-left">${payload.ref.replace('refs/heads/', '')}</span>
        </div>
        ${commits}
      `;
    } else if (event.type === 'CreateEvent') {
      return html`
        <div>
          Created <span class="mono bump-left">${payload.ref_type}</span> <span class="mono bump-left">${payload.ref}</span>
        </div>
      `;
    } else if (event.type === 'DeleteEvent') {
      return html`
        <div>
          Deleted <span class="mono bump-left">${payload.ref_type}</span> <span class="mono bump-left">${payload.ref}</span>
        </div>
      `;
    } else if (event.type === 'IssueCommentEvent'){
      return html`
        <div>Comment on <span class="mono bump-left">${payload.issue.title}</span></div>
        <div class="italic">"${payload.comment.body}"</div>
      `;
    } else if (event.type === 'PullRequestReviewCommentEvent'){
      return html`
        <div>Comment on <span class="mono bump-left">${payload.pull_request.title}</span></div>
        <div class="italic">"${payload.comment.body}"</div>
      `;
    } else if (event.type === 'PullRequestEvent') {
      return html`
        <div>Pull Request ${payload.action}: <span class="mono bump-left">${payload.pull_request.title}</span></div>
      `;
    } else {
      return event.type;
    }
  }
}
window.customElements.define('gew-event', GewEvent);
