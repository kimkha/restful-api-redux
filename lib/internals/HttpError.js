'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HttpError = function (_Error) {
    (0, _inherits3.default)(HttpError, _Error);

    function HttpError(message, status) {
        (0, _classCallCheck3.default)(this, HttpError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (HttpError.__proto__ || Object.getPrototypeOf(HttpError)).call(this, message));

        _this.message = message;
        _this.status = status;
        _this.name = _this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(_this, _this.constructor);
        } else {
            _this.stack = new Error(message).stack;
        }
        _this.stack = new Error().stack;
        return _this;
    }

    return HttpError;
}(Error);

exports.default = HttpError;
module.exports = exports['default'];