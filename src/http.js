export const get = (url, auth, onSuccess, onError) => {
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.setRequestHeader('Content-type', 'application/json');
  if (auth) {
    req.setRequestHeader('Authorization', auth);
  }
  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        return onSuccess ? onSuccess(req) : null;
      } else {
        return onError ? onError(req) : null;
      }
    }
  };
  req.send();
};
