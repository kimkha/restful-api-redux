import { API_REDUX_KEY, API_AUTHEN_KEY, API_REDUX_TRACK_KEY } from './constants';
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
  list: {
    ids: [],
  }
};

const restReducer = (state, payload) => {
  state = state || initialRestState;
  // TODO Parse reducer
  if (payload) {
    // Copy data before merge
    const data = Object.assign({}, state.data);

    if (Array.isArray(payload)) {
      // Response is an array of items
      const list = {
        ids: [],
      };// FIXME Should append the new list, instead reset list ids

      payload.forEach(item => {
        const id = item['id'] || item['_id'];
        if (id) {
          data[id] = item;
          list.ids.push(id);
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

const objectReducer = (state = initialState, { type, key, payload, isRest }) => {
  const apiTypes = toTypes(key);
  switch (type) {
    case apiTypes.LOADING:
      return Object.assign({}, state, {
        isLoading: true
      });
    case apiTypes.SUCCESS:
      if (isRest) {
        payload = restReducer(state.response, payload);
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

export const apiReducer = {
  [API_REDUX_KEY]: (state = {}, action) => {
    if (isApiType(action.type)) {
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
    if (isApiType(action.type) && action.trackingId) {
      // Only proceed API
      const status = revertType(action.type);
      return Object.assign({}, state, {
        [action.trackingId]: status,
      });
    }
    if (action.type === `${API_REDUX_TRACK_KEY}_RESET` && action.trackingId) {
      // Reset trackingId
      return Object.assign({}, state, {
        [action.trackingId]: '',
      });
    }
    return state;
  },
};
