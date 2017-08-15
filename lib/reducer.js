'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiReducer = exports.initialState = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _constants = require('./constants');

var _types = require('./internals/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = exports.initialState = {
  error: null,
  isLoading: false,
  response: null
};

var objectReducer = function objectReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var _ref = arguments[1];
  var type = _ref.type,
      key = _ref.key,
      payload = _ref.payload;

  var apiTypes = (0, _types.toTypes)(key);
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

var apiReducer = exports.apiReducer = (0, _defineProperty3.default)({}, _constants.API_REDUX_KEY, function () {
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
});