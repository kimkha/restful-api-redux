'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopEventSource = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _constants = require('./constants');

var _fetch = require('./internals/fetch');

var _eventsource = require('./internals/eventsource');

var _types = require('./internals/types');

var _token = require('./internals/token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var asyncRequest = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(apiAction, dispatch) {
    var apiTypes, _ref2, json;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            apiTypes = (0, _types.toTypes)(apiAction.key);


            dispatch({
              type: apiTypes.LOADING,
              key: apiAction.key,
              isLogin: apiAction.isLogin,
              isLogout: apiAction.isLogout,
              isRest: apiAction.isRest,
              group: apiAction.group,
              trackingId: apiAction.trackingId
            });

            _context.prev = 2;
            _context.next = 5;
            return (0, _fetch.fetchJson)(apiAction.endpoint, apiAction.fetchOptions);

          case 5:
            _ref2 = _context.sent;
            json = _ref2.json;

            if (!apiAction.isLogin) {
              _context.next = 12;
              break;
            }

            _context.next = 10;
            return (0, _token.saveToken)(apiAction.tokenConverter(json));

          case 10:
            _context.next = 15;
            break;

          case 12:
            if (!apiAction.isLogout) {
              _context.next = 15;
              break;
            }

            _context.next = 15;
            return (0, _token.removeToken)();

          case 15:

            dispatch({
              type: apiTypes.SUCCESS,
              payload: json,
              key: apiAction.key,
              isLogin: apiAction.isLogin,
              isLogout: apiAction.isLogout,
              isRest: apiAction.isRest,
              group: apiAction.group,
              shouldAppend: apiAction.shouldAppend,
              trackingId: apiAction.trackingId
            });

            return _context.abrupt('return', json);

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](2);

            console.log(_context.t0);

            dispatch({
              type: apiTypes.FAILURE,
              payload: _context.t0,
              key: apiAction.key,
              isLogin: apiAction.isLogin,
              isLogout: apiAction.isLogout,
              isRest: apiAction.isRest,
              group: apiAction.group,
              trackingId: apiAction.trackingId
            });

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 19]]);
  }));

  return function asyncRequest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var allEventSources = {};
var asyncEventSource = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(apiAction, dispatch) {
    var apiTypes;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            apiTypes = (0, _types.toTypes)(apiAction.key);
            _context2.prev = 1;

            if (allEventSources[apiAction.key]) {
              // Existing, stop it and re-init
              (0, _eventsource.closeEventSource)(allEventSources[apiAction.key]);
            }
            _context2.next = 5;
            return (0, _eventsource.createEventSource)(apiAction.endpoint, apiAction.fetchOptions, function (data) {
              dispatch({
                type: apiTypes.EVENTMSG,
                payload: data,
                key: apiAction.key,
                isEventSource: apiAction.isEventSource,
                onlyLast: apiAction.onlyLast,
                receiveAt: +new Date()
              }, function () {
                dispatch({
                  type: apiTypes.FAILURE,
                  payload: 'EventSource error',
                  key: apiAction.key,
                  isEventSource: apiAction.isEventSource,
                  onlyLast: apiAction.onlyLast
                });
              });
            });

          case 5:
            allEventSources[apiAction.key] = _context2.sent;
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](1);

            console.log(_context2.t0);

            dispatch({
              type: apiTypes.FAILURE,
              payload: _context2.t0,
              key: apiAction.key,
              isEventSource: apiAction.isEventSource
            });

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[1, 8]]);
  }));

  return function asyncEventSource(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var stopEventSource = exports.stopEventSource = function stopEventSource(key) {
  if (allEventSources[key]) {
    (0, _eventsource.closeEventSource)(allEventSources[key]);
  }
};

exports.default = function (_ref4) {
  var dispatch = _ref4.dispatch;
  return function (next) {
    return function (action) {
      var apiAction = action[_constants.API_ACTION_TYPE];

      // Ignore non-API actions.
      if ((typeof apiAction === 'undefined' ? 'undefined' : (0, _typeof3.default)(apiAction)) !== 'object') {
        return next(action);
      }

      if (apiAction.isEventSource) {
        return asyncEventSource(apiAction, dispatch);
      }

      return asyncRequest(apiAction, dispatch);
    };
  };
};