// Export modules
import { API_ACTION_TYPE, API_REDUX_KEY, API_AUTHEN_KEY, API_REDUX_TRACK_KEY } from './constants'
import apiMiddleware from './middleware'
import { apiReducer, initialState } from './reducer'

export { API_ACTION_TYPE, API_REDUX_KEY }
export { apiMiddleware }
export { apiReducer }

// Main functions
export const apiActionBuilder = (key, url, trackingId, options = {}) => ({
  [API_ACTION_TYPE]: {
    key,
    endpoint: url,
    fetchOptions: options,
    trackingId,
  },
});

// TODO Call RESTful API
export const apiRestBuilder = (key, url, trackingId, options = {}) => ({
  [API_ACTION_TYPE]: {
    key,
    endpoint: url,
    fetchOptions: options,
    isRest: true,
    trackingId,
  },
});

export const apiLoginBuilder = (url, trackingId, options = {}, tokenConverter = tk => tk) => ({
  [API_ACTION_TYPE]: {
    key: 'login',
    endpoint: url,
    fetchOptions: options,
    isLogin: true,
    tokenConverter,
    trackingId,
  },
});

export const apiResetTracking = (trackingId) => ({
  type: `${API_REDUX_TRACK_KEY}_RESET`,
  trackingId,
});

/**
 * Get state of an API
 * @param state
 * @param key
 * @return current state, format: { isLoading, response, error }
 */
export const convertApiState = (state, key) => (state && state[API_REDUX_KEY] && state[API_REDUX_KEY][key]) || initialState;

export const isLoginState = (state) => (state && state[API_REDUX_KEY] && state[API_REDUX_KEY][API_AUTHEN_KEY]);

export const convertRestListState = (state, key) => {
  const apiResult = convertApiState(state, key);
  if (apiResult.response) {
    const data = apiResult.response.data;
    const list = apiResult.response.list;
    if (list && list.ids && list.ids.length > 0) {
      return list.ids.map(id => data[id]);
    }
  }
  return [];
};

export const convertRestItemState = (state, key, id) => {
  const apiResult = convertApiState(state, key);
  if (apiResult.response) {
    const data = apiResult.response.data;
    return data && data[id];
  }
  return null;
};

export const convertApiStatus = (state, trackingId) => (state && state[API_REDUX_TRACK_KEY] && state[API_REDUX_TRACK_KEY][trackingId]) || '';