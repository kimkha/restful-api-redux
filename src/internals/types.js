import { API_ACTION_TYPE, API_PROFILE_KEY, API_LOGIN_KEY } from '../constants';

const baseTypes = [ 'LOADING', 'SUCCESS', 'FAILURE' ];
const specialTypes = [ API_PROFILE_KEY, API_LOGIN_KEY ].map(k => `${API_ACTION_TYPE}/${k.toUpperCase()}`);

export const toTypes = (key) =>
  baseTypes.reduce(
    (o, t) => Object.assign(o, { [t]: `${API_ACTION_TYPE}/${key ? key.toUpperCase() : ''}_${t}` }),
    {});

export const revertType = (type) => isApiType(type) && baseTypes.find(t => type.endsWith(t));

export const isApiType = (type) => type.indexOf(`${API_ACTION_TYPE}/`) === 0 && !specialTypes.some(t => type.indexOf(t) === 0);
