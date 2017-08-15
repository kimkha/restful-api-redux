'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _constants = require('./constants');

var _fetch = require('./internals/fetch');

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
              key: apiAction.key
            });

            _context.prev = 2;
            _context.next = 5;
            return (0, _fetch.fetchJson)(apiAction.endpoint, apiAction.fetchOptions);

          case 5:
            _ref2 = _context.sent;
            json = _ref2.json;

            if (!apiAction.isLogin) {
              _context.next = 10;
              break;
            }

            _context.next = 10;
            return (0, _token.saveToken)(apiAction.tokenConverter(json));

          case 10:

            dispatch({
              type: apiTypes.SUCCESS,
              payload: json,
              key: apiAction.key,
              isLogin: apiAction.isLogin
            });

            return _context.abrupt('return', json);

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](2);

            // console.log(error);

            dispatch({
              type: apiTypes.FAILURE,
              payload: _context.t0,
              key: apiAction.key,
              isLogin: apiAction.isLogin
            });

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 14]]);
  }));

  return function asyncRequest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = function (_ref3) {
  var dispatch = _ref3.dispatch;
  return function (next) {
    return function (action) {
      var apiAction = action[_constants.API_ACTION_TYPE];

      // Ignore non-API actions.
      if ((typeof apiAction === 'undefined' ? 'undefined' : (0, _typeof3.default)(apiAction)) !== 'object') {
        return next(action);
      }

      return asyncRequest(apiAction, dispatch);
    };
  };
};

module.exports = exports['default'];