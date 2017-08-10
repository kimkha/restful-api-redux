import { API_ACTION_TYPE } from './constants';
import { fetchJson } from './internals/fetch';
import { toTypes } from './internals/types';

export default ({ dispatch }) => next => action => {
  const apiAction = action[ API_ACTION_TYPE ];

  // Ignore non-api actions.
  if (typeof apiAction !== 'object') {
    return next(action);
  }

  const apiTypes = toTypes(apiAction.key);

  dispatch({
    type: apiTypes.LOADING,
    key: apiAction.key,
  });

  return new Promise((resolve, reject) => {
    fetchJson(apiAction.endpoint, apiAction.fetchOptions).then(({ json }) => {
      dispatch({
        type: apiTypes.SUCCESS,
        payload: json,
        key: apiAction.key,
      });

      resolve(json);
    }).catch(error => {
      dispatch({
        type: apiTypes.FAILURE,
        payload: error,
        key: apiAction.key,
      });

      reject(error);
    });
  });
}