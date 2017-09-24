import { getToken } from './token';

// TODO Add token
export const eventSource = async (url, options, onMessage, onError) => {
  let token = await getToken();
  if (token && token.id) {
    if (url.indexOf('?') >= 0) {
      url = url + '&access_token=' + token.id;
    } else {
      url = url + '?access_token=' + token.id;
    }
  }

  const src = new EventSource(url);
  src.onmessage = (msg) => {
    console.log(msg.data);
    const data = JSON.parse(msg.data);
    onMessage && onMessage(data);
  };
  src.onerror = () => {
    onError && onError();
  };

  return src;
};

export const closeEventSource = (eventSource) => {
  eventSource && eventSource.close();
};
