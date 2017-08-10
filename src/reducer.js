import { API_REDUX_KEY } from './constants';
import { toTypes, isApiType } from './internals/types';

export const initialState = {
  error: null,
  isLoading: false,
  response: null
};

const objectReducer = (state = initialState, { type, key, payload }) => {
  const apiTypes = toTypes(key);
  switch (type) {
    case apiTypes.LOADING:
      return Object.assign({}, state, {
        isLoading: true
      });
    case apiTypes.SUCCESS:
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
      return Object.assign({}, state, {
        [action.key]: objectReducer(state[ action.key ], action),
      });
    }
    return state;
  }
};
