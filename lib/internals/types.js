'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isApiType = exports.revertType = exports.toTypes = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseTypes = ['LOADING', 'SUCCESS', 'FAILURE'];

var toTypes = exports.toTypes = function toTypes(key) {
  return baseTypes.reduce(function (o, t) {
    return Object.assign(o, (0, _defineProperty3.default)({}, t, _constants.API_ACTION_TYPE + '/' + (key ? key.toUpperCase() : '') + '_' + t));
  }, {});
};

var revertType = exports.revertType = function revertType(type) {
  return isApiType(type) && baseTypes.find(function (t) {
    return type.endsWith(t);
  });
};

var isApiType = exports.isApiType = function isApiType(type) {
  return type.indexOf(_constants.API_ACTION_TYPE + '/') === 0;
};