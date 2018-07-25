import '@polymer/iron-image/iron-image';
import { LitElement, html } from '@polymer/lit-element';
import './gew-events/gew-create-event';
import './gew-events/gew-delete-event';
import './gew-events/gew-error-event';
import './gew-events/gew-fork-event';
import './gew-events/gew-issue-comment-event';
import './gew-events/gew-issues-event';
import './gew-events/gew-pull-request-event';
import './gew-events/gew-pull-request-review-comment-event';
import './gew-events/gew-push-event';
import './gew-events/gew-release-event';
import './gew-events/gew-unknown-event';
import './gew-events/gew-watch-event';

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
      return null;
    }
    console.log(event);
    switch(event.type) {
      case 'CreateEvent':
        return html`<gew-create-event event="${event}"></gew-create-event>`;
      case 'DeleteEvent':
        return html`<gew-delete-event event="${event}"></gew-delete-event>`;
      case 'ErrorEvent':
        return html`<gew-error-event event="${event}"></gew-error-event>`;
      case 'ForkEvent':
        return html`<gew-fork-event event="${event}"></gew-fork-event>`;
      case 'IssueCommentEvent':
        return html`<gew-issue-comment-event event="${event}"></gew-issue-comment-event>`;
      case 'IssuesEvent':
        return html`<gew-issues-event event="${event}"></gew-issues-event>`;
      case 'PullRequestEvent':
        return html`<gew-pull-request-event event="${event}"></gew-pull-request-event>`;
      case 'PullRequestReviewCommentEvent':
        return html`<gew-pull-request-review-comment-event event="${event}"></gew-pull-request-review-comment-event>`;
      case 'PushEvent':
        return html`<gew-push-event event="${event}"></gew-push-event>`;
      case 'ReleaseEvent':
        return html`<gew-release-event event="${event}"></gew-release-event>`;
      case 'WatchEvent':
        return html`<gew-watch-event event="${event}"></gew-watch-event>`;
      default:
        return html`<gew-unknown-event event="${event}"></gew-unknown-event>`;
    }
  }
}
window.customElements.define('gew-event', GewEvent);
