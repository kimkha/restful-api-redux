import { API_STORAGE_KEY } from '../constants';

let memoryToken = null;

export const saveToken = async (token) => {
  // console.log('Save token: ' + JSON.stringify(token));
  if (typeof AsyncStorage !== 'undefined') {
    await AsyncStorage.setItem(API_STORAGE_KEY, token);
  } else if (typeof Storage !== 'undefined') {
    localStorage.setItem(API_STORAGE_KEY, JSON.stringify(token));
  } else {
    memoryToken = token;
  }
  return 'ok';
};

// TODO Expire token?
export const getToken = async () => {
  let token = null;
  if (typeof AsyncStorage !== 'undefined') {
    token = await AsyncStorage.getItem(API_STORAGE_KEY);
  } else if (typeof Storage !== 'undefined') {
    const t = localStorage.getItem(API_STORAGE_KEY);
    try {
      token = JSON.parse(t);
    } catch (e) {
      return null;
    }
  } else {
    token = memoryToken;
  }

  if (token) {
    // Check expire token
    if (token.created && token.ttl) {
      const created = +new Date(token.created);
      return ((+(new Date()) < created + token.ttl*1000) && token);
    }
  }
};
