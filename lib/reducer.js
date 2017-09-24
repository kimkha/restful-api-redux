'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiReducer = exports.initialEventSourceState = exports.initialUserState = exports.initialRestState = exports.initialState = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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
  last: {
    item: null
  },
  list: {}
};

var initialUserState = exports.initialUserState = {
  status: 'UNAUTHENTICATED', // LOGGING_IN, LOGIN_ERR, LOGGED_IN, AUTHENTICATED
  error: null,
  profile: null
};

var initialEventSourceState = exports.initialEventSourceState = {
  error: null,
  data: [],
  last: null
};

var restReducer = function restReducer(state, payload) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  state = state || initialRestState;
  // Parse reducer
  if (payload) {
    // Copy data before merge
    var data = Object.assign({}, state.data);

    if (Array.isArray(payload)) {
      // Response is an array of items

      var group = options['group'] || 'ids';
      var shouldAppend = options['shouldAppend'] || false;
      var oldList = state.list || {};

      var list = Object.assign({}, oldList, (0, _defineProperty3.default)({}, group, shouldAppend ? oldList[group] || [] : []));

      payload.forEach(function (item) {
        var id = item['id'] || item['_id'];
        if (id) {
          data[id] = item;
          list[group].push(id);
        }
      });

      return Object.assign({}, state, { list: list, data: data });
    } else {
      // Response is an item
      var id = payload['id'] || payload['_id'];
      if (id) {
        data[id] = payload;
      }
      var last = {
        item: payload
      };

      return Object.assign({}, state, { last: last, data: data });
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
      isRest = _ref.isRest,
      options = (0, _objectWithoutProperties3.default)(_ref, ['type', 'key', 'payload', 'isRest']);

  var apiTypes = (0, _types.toTypes)(key);
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

var profileReducer = function profileReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialUserState;
  var _ref2 = arguments[1];
  var type = _ref2.type,
      key = _ref2.key,
      payload = _ref2.payload;

  var apiTypes = (0, _types.toTypes)(key);
  switch (type) {
    case apiTypes.SUCCESS:
      return Object.assign({}, state, {
        profile: payload,
        status: 'AUTHENTICATED'
      });
    case apiTypes.FAILURE:
      return Object.assign({}, state, {
        error: payload,
        status: 'UNAUTHENTICATED'
      });
    default:
      return state;
  }
};

var loginReducer = function loginReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialUserState;
  var _ref3 = arguments[1];
  var type = _ref3.type,
      key = _ref3.key,
      payload = _ref3.payload;

  var apiTypes = (0, _types.toTypes)(key);
  switch (type) {
    case apiTypes.LOADING:
      return Object.assign({}, state, {
        status: 'LOGGING_IN'
      });
    case apiTypes.SUCCESS:
      return Object.assign({}, state, {
        status: 'LOGGED_IN'
      });
    case apiTypes.FAILURE:
      return Object.assign({}, state, {
        error: payload,
        status: 'LOGIN_ERR'
      });
    default:
      return state;
  }
};

var eventSourceReducer = function eventSourceReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialEventSourceState;
  var _ref4 = arguments[1];
  var type = _ref4.type,
      key = _ref4.key,
      payload = _ref4.payload,
      onlyLast = _ref4.onlyLast,
      receiveAt = _ref4.receiveAt;

  var apiTypes = (0, _types.toTypes)(key);
  switch (type) {
    case apiTypes.EVENTMSG:
      var data = [];
      if (!onlyLast) {
        data = Object.assign([], state.data);
        data.push(payload);
      }

      return {
        error: null,
        data: data,
        last: payload,
        receiveAt: receiveAt
      };
    case apiTypes.FAILURE:
      return Object.assign({}, state, {
        error: payload
      });
    default:
      return state;
  }
};

var apiReducer = exports.apiReducer = (_apiReducer = {}, (0, _defineProperty3.default)(_apiReducer, _constants.API_REDUX_KEY, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if ((0, _types.isApiType)(action.type) && !action.isEventSource) {
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

  if ((0, _types.isApiType)(action.type) && !action.isEventSource && action.trackingId) {
    // Only proceed API
    var status = (0, _types.revertType)(action.type);
    return Object.assign({}, state, (0, _defineProperty3.default)({}, action.trackingId, status));
  }
  if (action && action.type === _constants.API_REDUX_TRACK_KEY + '_RESET' && action.trackingId) {
    // Reset trackingId
    return Object.assign({}, state, (0, _defineProperty3.default)({}, action.trackingId, ''));
  }
  return state;
}), (0, _defineProperty3.default)(_apiReducer, _constants.API_REDUX_EVENT_KEY, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.isEventSource) {
    var obj = eventSourceReducer(state[action.key], action);
    var result = (0, _defineProperty3.default)({}, action.key, obj);
    return Object.assign({}, state, result);
  }
  return state;
}), (0, _defineProperty3.default)(_apiReducer, _constants.API_REDUX_AUTHEN_KEY, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.key === _constants.API_PROFILE_KEY) {
    return profileReducer(state, action);
  } else if (action.key === _constants.API_LOGIN_KEY) {
    return loginReducer(state, action);
  } else if (action.key === _constants.API_LOGOUT_KEY) {
    return Object.assign({}, initialUserState);
  }
  return state;
}), _apiReducer);