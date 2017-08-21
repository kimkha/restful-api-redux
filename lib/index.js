'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertRestItemState = exports.convertRestListState = exports.isLoginState = exports.convertApiState = exports.apiLoginBuilder = exports.apiRestBuilder = exports.apiActionBuilder = exports.apiReducer = exports.apiMiddleware = exports.API_REDUX_KEY = exports.API_ACTION_TYPE = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _constants = require('./constants');

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _reducer = require('./reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.API_ACTION_TYPE = _constants.API_ACTION_TYPE;
exports.API_REDUX_KEY = _constants.API_REDUX_KEY; // Export modules

exports.apiMiddleware = _middleware2.default;
exports.apiReducer = _reducer.apiReducer;

// Main functions

var apiActionBuilder = exports.apiActionBuilder = function apiActionBuilder(key, url) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: key,
    endpoint: url,
    fetchOptions: options
  });
};

// TODO Call RESTful API
var apiRestBuilder = exports.apiRestBuilder = function apiRestBuilder(key, url) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: key,
    endpoint: url,
    fetchOptions: options,
    isRest: true
  });
};

var apiLoginBuilder = exports.apiLoginBuilder = function apiLoginBuilder(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var tokenConverter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (tk) {
    return tk;
  };
  return (0, _defineProperty3.default)({}, _constants.API_ACTION_TYPE, {
    key: 'login',
    endpoint: url,
    fetchOptions: options,
    isLogin: true,
    tokenConverter: tokenConverter
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

var isLoginState = exports.isLoginState = function isLoginState(state) {
  return state && state[_constants.API_REDUX_KEY] && state[_constants.API_REDUX_KEY][_constants.API_AUTHEN_KEY];
};

var convertRestListState = exports.convertRestListState = function convertRestListState(state, key) {
  var apiResult = convertApiState(state, key);
  if (apiResult.response) {
    var data = apiResult.response.data;
    var list = apiResult.response.list;
    if (list && list.ids && list.ids.length > 0) {
      return list.ids.map(function (id) {
        return data[id];
      });
    }
  }
  return [];
};

var convertRestItemState = exports.convertRestItemState = function convertRestItemState(state, key) {
  var apiResult = convertApiState(state, key);
  if (apiResult.response && apiResult.response.last) {
    return apiResult.response.last.item;
  }
  return null;
};