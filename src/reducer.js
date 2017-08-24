import { API_REDUX_KEY, API_AUTHEN_KEY, API_REDUX_TRACK_KEY } from './constants';
import { toTypes, isApiType, revertType } from './internals/types';

export const initialState = {
  error: null,
  isLoading: false,
  response: null
};

export const initialRestState = {
  data: {},
  rawData: [],
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
    if (Array.isArray(payload)) {
      // Response is an array of items
      state.rawData = payload;
      state.list.ids = [];// FIXME Should append the new list, instead reset list ids
      payload.forEach(item => {
        const id = item['id'] || item['_id'];
        if (id) {
          state.data[id] = item;
          state.list.ids.push(id);
        }
      });
    } else {
      // Response is an item
      const id = payload['id'] || payload['_id'];
      if (id) {
        state.data[id] = payload;
      }
      state.last.item = payload;
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
    return state;
  },
};
