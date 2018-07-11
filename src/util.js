export const pluralize = (singular, plural, number) => {
  return number === 1 ? singular : plural;
};

export const replaceGitHubEmoji = message => {
  while (message.includes(':+1:')) {
    message = message.replace(':+1:', '👍');
  }
  while (message.includes(':-1:')) {
    message = message.replace(':-1:', '👎');
  }
  return message;
};

export const timeAgo = time => {
  if (time < 1000) {
    return 'just now';
  }
  let seconds = time / 1000;
  if (seconds < 60) {
    seconds = seconds.toFixed();
    return seconds + ' ' + pluralize('second', 'seconds', seconds) + ' ago';
  }
  let minutes = seconds / 60;
  if (minutes < 60) {
    minutes = minutes.toFixed();
    return minutes + ' ' + pluralize('minute', 'minutes', minutes) + ' ago';
  }
  let hours = minutes / 60;
  if (hours < 24) {
    hours = hours.toFixed();
    return hours + ' ' + pluralize('hour', 'hours', hours) + ' ago';
  }
  const days = (hours / 24).toFixed();
  return days + ' ' + pluralize('day', 'days', days) + ' ago';
};
