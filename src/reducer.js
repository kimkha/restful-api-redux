import {
  API_REDUX_KEY, API_AUTHEN_KEY, API_REDUX_TRACK_KEY, API_REDUX_AUTHEN_KEY, API_PROFILE_KEY, API_LOGIN_KEY,
  API_LOGOUT_KEY, API_REDUX_EVENT_KEY
} from './constants';
import { toTypes, isApiType, revertType } from './internals/types';

export const initialState = {
  error: null,
  isLoading: false,
  response: null
};

export const initialRestState = {
  data: {},
  last: {
    item: null,
  },
  list: {},
};

export const initialUserState = {
  status: 'UNAUTHENTICATED', // LOGGING_IN, LOGIN_ERR, LOGGED_IN, AUTHENTICATED
  error: null,
  profile: null,
};

export const initialEventSourceState = {
  error: null,
  data: [],
  last: null,
};

const restReducer = (state, payload, options = {}) => {
  state = state || initialRestState;
  // Parse reducer
  if (payload) {
    // Copy data before merge
    const data = Object.assign({}, state.data);

    if (Array.isArray(payload)) {
      // Response is an array of items

      const group = options['group'] || 'ids';
      const shouldAppend = options['shouldAppend'] || false;
      const oldList = state.list || {};

      const list = Object.assign({}, oldList, {
        [group]: shouldAppend ? (oldList[group] || []) : [],
      });

      payload.forEach(item => {
        const id = item['id'] || item['_id'];
        if (id) {
          data[id] = item;
          list[group].push(id);
        }
      });

      return Object.assign({}, state, { list, data });
    } else {
      // Response is an item
      const id = payload['id'] || payload['_id'];
      if (id) {
        data[id] = payload;
      }
      const last = {
        item: payload,
      };

      return Object.assign({}, state, { last, data });
    }
  }
  return state;
};

const objectReducer = (state = initialState, { type, key, payload, isRest, ...options }) => {
  const apiTypes = toTypes(key);
  switch (type) {
    case apiTypes.LOADING:
      return Object.assign({}, state, {
        isLoading: true
      });
    case apiTypes.SUCCESS:
      if (isRest) {
        payload = restReducer(state.response, payload, options);
      }
      return Object.assign({}, state, {
        error: null,
        isLoading: false,
        response: payload
      });
    case apiTypes.FAILURE:
      return Object.assign({}, state, {
        error: payload,
        isLoading: false
      });
    default:
      return state;
  }
};

const profileReducer = (state = initialUserState, { type, key, payload }) => {
  const apiTypes = toTypes(key);
  switch (type) {
    case apiTypes.SUCCESS:
      return Object.assign({}, state, {
        profile: payload,
        status: 'AUTHENTICATED',
      });
    case apiTypes.FAILURE:
      return Object.assign({}, state, {
        error: payload,
        status: 'UNAUTHENTICATED',
      });
    default:
      return state;
  }
};

const loginReducer = (state = initialUserState, { type, key, payload }) => {
  const apiTypes = toTypes(key);
  switch (type) {
    case apiTypes.LOADING:
      return Object.assign({}, state, {
        status: 'LOGGING_IN',
      });
    case apiTypes.SUCCESS:
      return Object.assign({}, state, {
        status: 'LOGGED_IN',
      });
    case apiTypes.FAILURE:
      return Object.assign({}, state, {
        error: payload,
        status: 'LOGIN_ERR',
      });
    default:
      return state;
  }
};

const eventSourceReducer = (state = initialEventSourceState, { type, key, payload, onlyLast, receiveAt }) => {
  const apiTypes = toTypes(key);
  switch (type) {
    case apiTypes.EVENTMSG:
      let data = [];
      if (!onlyLast) {
        data = Object.assign([], state.data);
        data.push(payload);
      }

      return {
        error: null,
        data,
        last: payload,
        receiveAt,
      };
    case apiTypes.FAILURE:
      return Object.assign({}, state, {
        error: payload,
      });
    default:
      return state;
  }
};

export const apiReducer = {
  [API_REDUX_KEY]: (state = {}, action) => {
    if (isApiType(action.type) && !action.isEventSource) {
      // Only proceed API
      const obj = objectReducer(state[ action.key ], action);
      const result = {
        [action.key]: obj,
      };
      if (obj.error && obj.error.status === 401 && !state[API_AUTHEN_KEY]) {
        // Authentication Error
        result[API_AUTHEN_KEY] = false;
      } else if (!obj.error && action.isLogin) {
        // Reset authen
        result[API_AUTHEN_KEY] = true;
      }
      return Object.assign({}, state, result);
    }
    return state;
  },
  [API_REDUX_TRACK_KEY]: (state = {}, action) => {
    if (isApiType(action.type) && !action.isEventSource && action.trackingId) {
      // Only proceed API
      const status = revertType(action.type);
      return Object.assign({}, state, {
        [action.trackingId]: status,
      });
    }
    if (action && action.type === `${API_REDUX_TRACK_KEY}_RESET` && action.trackingId) {
      // Reset trackingId
      return Object.assign({}, state, {
        [action.trackingId]: '',
      });
    }
    return state;
  },
  [API_REDUX_EVENT_KEY]: (state = {}, action) => {
    if (action.isEventSource) {
      const obj = eventSourceReducer(state[ action.key ], action);
      const result = {
        [action.key]: obj,
      };
      return Object.assign({}, state, result);
    }
    return state;
  },
  [API_REDUX_AUTHEN_KEY]: (state = {}, action) => {
    if (action.key === API_PROFILE_KEY) {
      return profileReducer(state, action);
    } else if (action.key === API_LOGIN_KEY) {
      return loginReducer(state, action);
    } else if (action.key === API_LOGOUT_KEY) {
      return Object.assign({}, initialUserState);
    }
    return state;
  }
};
