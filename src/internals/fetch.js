import HttpError from './HttpError';

if (typeof GLOBAL !== 'undefined') {
  // For debugging network requests on React-native

  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
}

export const fetchJson = (url, options = {}) => {
  // if (url && !/^https?:\/\//.test(url)) {
  //     url = Config.apiUrl + url;
  // }

  const requestHeaders = options.headers || new Headers({
    Accept: 'application/json',
  });
  if (!(options && options.body && options.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (options.user && options.user.authenticated && options.user.token) {
    requestHeaders.set('Authorization', options.user.token);
  } else {
    // let token = storage.load('lbtoken');
    // if (token && token.id) {
    //     if (url.indexOf('?') >= 0) {
    //         url = url + '&access_token=' + token.id;
    //     } else {
    //         url = url + '?access_token=' + token.id;
    //     }
    // }
    // // Cookie mode ONLY
    // options.credentials = 'include';
  }

  return fetch(url, { ...options, headers: requestHeaders })
    .then(response => response.text().then(text => ({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: text,
    })))
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
      }
      if (status < 200 || status >= 300) {
        return Promise.reject(new HttpError((json && json.message) || statusText, status));
      }
      return { status, headers, body, json };
    });
};

export const queryParameters = data => Object.keys(data)
  .map(key => [ key, data[ key ] ].map(encodeURIComponent).join('='))
  .join('&');
