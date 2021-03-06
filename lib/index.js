'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertAllEventSourceState = exports.convertLastEventSourceState = exports.convertApiStatus = exports.convertRestItemState = exports.convertRestListState = exports.convertAuthenState = exports.convertApiState = exports.eventSourceBuilder = exports.apiResetTracking = exports.apiLogoutBuilder = exports.apiLoginBuilder = exports.apiProfileBuilder = exports.apiRestBuilder = exports.apiActionBuilder = exports.queryParameters = exports.apiReducer = exports.stopEventSource = exports.apiMiddleware = exports.API_REDUX_KEY = exports.API_ACTION_TYPE = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _fetch = require('./internals/fetch');

Object.defineProperty(exports, 'queryParameters', {
  enumerable: true,
  get: function get() {
    return _fetch.queryParameters;
  }
});

var _constants = require('./constants');

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _reducer = require('./reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.API_ACTION_TYPE = _constants.API_ACTION_TYPE;
exports.API_REDUX_KEY = _constants.API_REDUX_KEY; // Export modules

exports.apiMiddleware = _middleware2.default;
exports.stopEventSource = _middleware.stopEventSource;
exports.apiReducer = _reducer.apiReducer;


// Main functions
var apiActionBuilder = exports.apiActionBuilder = function apiActionBuilder(key, url, trackingId) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: key,
    endpoint: url,
    fetchOptions: options,
    trackingId: trackingId
  });
};

// TODO Call RESTful API
var apiRestBuilder = exports.apiRestBuilder = function apiRestBuilder(key, url, group, shouldAppend, trackingId) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: key,
    endpoint: url,
    fetchOptions: options,
    isRest: true,
    group: group,
    shouldAppend: shouldAppend,
    trackingId: trackingId
  });
};

var apiProfileBuilder = exports.apiProfileBuilder = function apiProfileBuilder(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: _constants.API_PROFILE_KEY,
    endpoint: url,
    fetchOptions: options
  });
};

var apiLoginBuilder = exports.apiLoginBuilder = function apiLoginBuilder(url, trackingId) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var tokenConverter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (tk) {
    return tk;
  };
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: _constants.API_LOGIN_KEY,
    endpoint: url,
    fetchOptions: options,
    isLogin: true,
    tokenConverter: tokenConverter,
    trackingId: trackingId
  });
};

var apiLogoutBuilder = exports.apiLogoutBuilder = function apiLogoutBuilder(url, trackingId) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: _constants.API_LOGOUT_KEY,
    endpoint: url,
    fetchOptions: options,
    isLogout: true,
    trackingId: trackingId
  });
};

var apiResetTracking = exports.apiResetTracking = function apiResetTracking(trackingId) {
  return {
    type: _constants.API_REDUX_TRACK_KEY + '_RESET',
    trackingId: trackingId
  };
};

var eventSourceBuilder = exports.eventSourceBuilder = function eventSourceBuilder(key, url) {
  var onlyLast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: key,
    endpoint: url,
    fetchOptions: options,
    isEventSource: true,
    onlyLast: onlyLast
  });
};

/**
 * Get state of an API
 * @param state
 * @param key
 * @return current state, format: { isLoading, response, error }
 */
var convertApiState = exports.convertApiState = function convertApiState(state, key) {
  return state && state[_constants.API_REDUX_KEY] && state[_constants.API_REDUX_KEY][key] || _reducer.initialState;
};

var convertAuthenState = exports.convertAuthenState = function convertAuthenState(state) {
  return state && state[_constants.API_REDUX_AUTHEN_KEY] || _reducer.initialUserState;
};

var convertRestListState = exports.convertRestListState = function convertRestListState(state, key) {
  var group = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ids';

  var apiResult = convertApiState(state, key);
  if (apiResult.response) {
    var data = apiResult.response.data;
    var list = apiResult.response.list;
    if (list && list[group] && list[group].length > 0) {
      return list[group].map(function (id) {
        return data[id];
      });
    }
  }
  return [];
};

var convertRestItemState = exports.convertRestItemState = function convertRestItemState(state, key, id) {
  var apiResult = convertApiState(state, key);
  if (apiResult.response) {
    var data = apiResult.response.data;
    return data && data[id];
  }
  return null;
};

var convertApiStatus = exports.convertApiStatus = function convertApiStatus(state, trackingId) {
  return state && state[_constants.API_REDUX_TRACK_KEY] && state[_constants.API_REDUX_TRACK_KEY][trackingId] || '';
};

var convertEventSourceState = function convertEventSourceState(state, key) {
  return state && state[_constants.API_REDUX_EVENT_KEY] && state[_constants.API_REDUX_EVENT_KEY][key] || _reducer.initialEventSourceState;
};

var convertLastEventSourceState = exports.convertLastEventSourceState = function convertLastEventSourceState(state, key) {
  var message = convertEventSourceState(state, key);
  if (message && message.last) {
    return message.last;
  }
  return null;
};

var convertAllEventSourceState = exports.convertAllEventSourceState = function convertAllEventSourceState(state, key) {
  var message = convertEventSourceState(state, key);
  if (message && message.data && message.data.length > 0) {
    return message.data;
  }
  return null;
};