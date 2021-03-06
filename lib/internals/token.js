'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToken = exports.removeToken = exports.saveToken = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memoryToken = null;

var saveToken = exports.saveToken = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(token) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof AsyncStorage !== 'undefined')) {
              _context.next = 5;
              break;
            }

            _context.next = 3;
            return AsyncStorage.setItem(_constants.API_STORAGE_KEY, token);

          case 3:
            _context.next = 6;
            break;

          case 5:
            if (typeof Storage !== 'undefined') {
              localStorage.setItem(_constants.API_STORAGE_KEY, JSON.stringify(token));
            } else {
              memoryToken = token;
            }

          case 6:
            return _context.abrupt('return', 'ok');

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function saveToken(_x) {
    return _ref.apply(this, arguments);
  };
}();

var removeToken = exports.removeToken = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(typeof AsyncStorage !== 'undefined')) {
              _context2.next = 5;
              break;
            }

            _context2.next = 3;
            return AsyncStorage.removeItem(_constants.API_STORAGE_KEY);

          case 3:
            _context2.next = 6;
            break;

          case 5:
            if (typeof Storage !== 'undefined') {
              localStorage.removeItem(_constants.API_STORAGE_KEY, JSON.stringify(token));
            } else {
              memoryToken = null;
            }

          case 6:
            return _context2.abrupt('return', 'ok');

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function removeToken() {
    return _ref2.apply(this, arguments);
  };
}();

// TODO Expire token?
var getToken = exports.getToken = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var token, t, created;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            token = null;

            if (!(typeof AsyncStorage !== 'undefined')) {
              _context3.next = 7;
              break;
            }

            _context3.next = 4;
            return AsyncStorage.getItem(_constants.API_STORAGE_KEY);

          case 4:
            token = _context3.sent;
            _context3.next = 19;
            break;

          case 7:
            if (!(typeof Storage !== 'undefined')) {
              _context3.next = 18;
              break;
            }

            t = localStorage.getItem(_constants.API_STORAGE_KEY);
            _context3.prev = 9;

            token = JSON.parse(t);
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3['catch'](9);
            return _context3.abrupt('return', null);

          case 16:
            _context3.next = 19;
            break;

          case 18:
            token = memoryToken;

          case 19:
            if (!token) {
              _context3.next = 23;
              break;
            }

            if (!(token.created && token.ttl)) {
              _context3.next = 23;
              break;
            }

            created = +new Date(token.created);
            return _context3.abrupt('return', +new Date() < created + token.ttl * 1000 && token);

          case 23:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[9, 13]]);
  }));

  return function getToken() {
    return _ref3.apply(this, arguments);
  };
}();