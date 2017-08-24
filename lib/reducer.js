'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiReducer = exports.initialRestState = exports.initialState = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _apiReducer;

var _constants = require('./constants');

var _types = require('./internals/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = exports.initialState = {
  error: null,
  isLoading: false,
  response: null
};

var initialRestState = exports.initialRestState = {
  data: {},
  rawData: [],
  last: {
    item: null
  },
  list: {
    ids: []
  }
};

var restReducer = function restReducer(state, payload) {
  state = state || initialRestState;
  // TODO Parse reducer
  if (payload) {
    if (Array.isArray(payload)) {
      // Response is an array of items
      state.rawData = payload;
      state.list.ids = []; // FIXME Should append the new list, instead reset list ids
      payload.forEach(function (item) {
        var id = item['id'] || item['_id'];
        if (id) {
          state.data[id] = item;
          state.list.ids.push(id);
        }
      });
    } else {
      // Response is an item
      var id = payload['id'] || payload['_id'];
      if (id) {
        state.data[id] = payload;
      }
      state.last.item = payload;
    }
  }
  return state;
};

var objectReducer = function objectReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var _ref = arguments[1];
  var type = _ref.type,
      key = _ref.key,
      payload = _ref.payload,
      isRest = _ref.isRest;

  var apiTypes = (0, _types.toTypes)(key);
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

var apiReducer = exports.apiReducer = (_apiReducer = {}, (0, _defineProperty3.default)(_apiReducer, _constants.API_REDUX_KEY, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if ((0, _types.isApiType)(action.type)) {
    // Only proceed API
    var obj = objectReducer(state[action.key], action);
    var result = (0, _defineProperty3.default)({}, action.key, obj);
    if (obj.error && obj.error.status === 401 && !state[_constants.API_AUTHEN_KEY]) {
      // Authentication Error
      result[_constants.API_AUTHEN_KEY] = false;
    } else if (!obj.error && action.isLogin) {
      // Reset authen
      result[_constants.API_AUTHEN_KEY] = true;
    }
    return Object.assign({}, state, result);
  }
  return state;
}), (0, _defineProperty3.default)(_apiReducer, _constants.API_REDUX_TRACK_KEY, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if ((0, _types.isApiType)(action.type) && action.trackingId) {
    // Only proceed API
    var status = (0, _types.revertType)(action.type);
    return Object.assign({}, state, (0, _defineProperty3.default)({}, action.trackingId, status));
  }
  if (action.type === _constants.API_REDUX_TRACK_KEY + '_RESET' && action.trackingId) {
    // Reset trackingId
    return Object.assign({}, state, (0, _defineProperty3.default)({}, action.trackingId, ''));
  }
  return state;
}), _apiReducer);