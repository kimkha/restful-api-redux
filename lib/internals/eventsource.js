'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeEventSource = exports.createEventSource = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _token = require('./token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO Add token
var createEventSource = exports.createEventSource = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, options, onMessage, onError) {
    var token, src;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _token.getToken)();

          case 2:
            token = _context.sent;

            if (token && token.id) {
              if (url.indexOf('?') >= 0) {
                url = url + '&access_token=' + token.id;
              } else {
                url = url + '?access_token=' + token.id;
              }
            }

            src = new EventSource(url);

            src.addEventListener('data', function (msg) {
              var data = JSON.parse(msg.data);
              onMessage && onMessage(data);
            });
            src.onerror = function () {
              onError && onError();
            };

            return _context.abrupt('return', src);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createEventSource(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var closeEventSource = exports.closeEventSource = function closeEventSource(eventSource) {
  eventSource && eventSource.close();
};