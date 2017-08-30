'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryParameters = exports.fetchJson = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _HttpError = require('./HttpError');

var _HttpError2 = _interopRequireDefault(_HttpError);

var _token = require('./token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof GLOBAL !== 'undefined') {
  // For debugging network requests on React-native

  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
}

var fetchJson = exports.fetchJson = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var requestHeaders, token;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // if (url && !/^https?:\/\//.test(url)) {
            //     url = Config.apiUrl + url;
            // }

            requestHeaders = options.headers || new Headers({
              Accept: 'application/json'
            });

            if (!(options && options.body && options.body instanceof FormData)) {
              requestHeaders.set('Content-Type', 'application/json');
            }

            if (!(options.user && options.user.authenticated && options.user.token)) {
              _context.next = 6;
              break;
            }

            requestHeaders.set('Authorization', options.user.token);
            _context.next = 10;
            break;

          case 6:
            _context.next = 8;
            return (0, _token.getToken)();

          case 8:
            token = _context.sent;

            if (token && token.id) {
              if (url.indexOf('?') >= 0) {
                url = url + '&access_token=' + token.id;
              } else {
                url = url + '?access_token=' + token.id;
              }
            }
            // // Cookie mode ONLY
            // options.credentials = 'include';

          case 10:
            _context.next = 12;
            return fetch(url, (0, _extends3.default)({}, options, { headers: requestHeaders })).then(function (response) {
              return response.text().then(function (text) {
                return {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers,
                  body: text
                };
              });
            }).then(function (_ref2) {
              var status = _ref2.status,
                  statusText = _ref2.statusText,
                  headers = _ref2.headers,
                  body = _ref2.body;

              var json = void 0;
              try {
                json = JSON.parse(body);
              } catch (e) {
                // not json, no big deal
              }
              if (status < 200 || status >= 300) {
                return Promise.reject(new _HttpError2.default(json && json.message || statusText, status));
              }
              return { status: status, headers: headers, body: body, json: json };
            });

          case 12:
            return _context.abrupt('return', _context.sent);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchJson(_x) {
    return _ref.apply(this, arguments);
  };
}();

var queryParameters = exports.queryParameters = function queryParameters(data) {
  return !data ? '' : Object.keys(data).map(function (key) {
    return [key, data[key]].map(encodeURIComponent).join('=');
  }).join('&');
};