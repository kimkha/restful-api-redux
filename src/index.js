// Export modules
import {
  API_ACTION_TYPE, API_REDUX_KEY, API_AUTHEN_KEY, API_REDUX_TRACK_KEY, API_REDUX_AUTHEN_KEY, API_PROFILE_KEY,
  API_LOGIN_KEY, API_LOGOUT_KEY, API_REDUX_EVENT_KEY
} from './constants';
import apiMiddleware, { stopEventSource } from './middleware';
import { apiReducer, initialEventSourceState, initialState, initialUserState } from './reducer';

export { API_ACTION_TYPE, API_REDUX_KEY };
export { apiMiddleware, stopEventSource };
export { apiReducer };
export { queryParameters } from './internals/fetch';

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
export const apiRestBuilder = (key, url, group, shouldAppend, trackingId, options = {}) => ({
  [API_ACTION_TYPE]: {
    key,
    endpoint: url,
    fetchOptions: options,
    isRest: true,
    group,
    shouldAppend,
    trackingId,
  },
});

export const apiProfileBuilder = (url, options = {}) => ({
  [API_ACTION_TYPE]: {
    key: API_PROFILE_KEY,
    endpoint: url,
    fetchOptions: options,
  },
});

export const apiLoginBuilder = (url, trackingId, options = {}, tokenConverter = tk => tk) => ({
  [API_ACTION_TYPE]: {
    key: API_LOGIN_KEY,
    endpoint: url,
    fetchOptions: options,
    isLogin: true,
    tokenConverter,
    trackingId,
  },
});

export const apiLogoutBuilder = (url, trackingId, options = {}) => ({
  [API_ACTION_TYPE]: {
    key: API_LOGOUT_KEY,
    endpoint: url,
    fetchOptions: options,
    isLogout: true,
    trackingId,
  },
});

export const apiResetTracking = (trackingId) => ({
  type: `${API_REDUX_TRACK_KEY}_RESET`,
  trackingId,
});

export const eventSourceBuilder = (key, url, onlyLast = true, options = {}) => ({
  [API_ACTION_TYPE]: {
    key,
    endpoint: url,
    fetchOptions: options,
    isEventSource: true,
    onlyLast,
  },
});

/**
 * Get state of an API
 * @param state
 * @param key
 * @return current state, format: { isLoading, response, error }
 */
export const convertApiState = (state, key) => (state && state[ API_REDUX_KEY ] && state[ API_REDUX_KEY ][ key ]) || initialState;

export const convertAuthenState = (state) => (state && state[ API_REDUX_AUTHEN_KEY ]) || initialUserState;

export const convertRestListState = (state, key, group = 'ids') => {
  const apiResult = convertApiState(state, key);
  if (apiResult.response) {
    const data = apiResult.response.data;
    const list = apiResult.response.list;
    if (list && list[ group ] && list[ group ].length > 0) {
      return list[ group ].map(id => data[ id ]);
    }
  }
  return [];
};

export const convertRestItemState = (state, key, id) => {
  const apiResult = convertApiState(state, key);
  if (apiResult.response) {
    const data = apiResult.response.data;
    return data && data[ id ];
  }
  return null;
};

export const convertApiStatus = (state, trackingId) => (state && state[ API_REDUX_TRACK_KEY ] && state[ API_REDUX_TRACK_KEY ][ trackingId ]) || '';

const convertEventSourceState = (state, key) => (state && state[ API_REDUX_EVENT_KEY ] && state[ API_REDUX_EVENT_KEY ][ key ]) || initialEventSourceState;

export const convertLastEventSourceState = (state, key) => {
  const message = convertEventSourceState(state, key);
  if (message && message.last) {
    return message.last;
  }
  return null;
};

export const convertAllEventSourceState = (state, key) => {
  const message = convertEventSourceState(state, key);
  if (message && message.data && message.data.length > 0) {
    return message.data;
  }
  return null;
};
