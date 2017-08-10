import { API_ACTION_TYPE } from '../constants';

const baseTypes = [ 'LOADING', 'SUCCESS', 'FAILURE' ];

export const toTypes = (key) =>
  baseTypes.reduce(
    (o, t) => Object.assign(o, { [t]: `${API_ACTION_TYPE}/${key ? key.toUpperCase() : ''}_${t}` }),
    {});

export const isApiType = (type) => type.indexOf(`${API_ACTION_TYPE}/`) === 0;
