import { API_ACTION_TYPE } from './constants';
import { fetchJson } from './internals/fetch';
import { toTypes } from './internals/types';
import { saveToken } from './internals/token';

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

  return fetchJson(apiAction.endpoint, apiAction.fetchOptions).then(({ json }) => {
    if (apiAction.isLogin) {
      saveToken(apiAction.tokenConverter(json));
    }

    dispatch({
      type: apiTypes.SUCCESS,
      payload: json,
      key: apiAction.key,
      isLogin: apiAction.isLogin,
    });

    return json;
  }).catch(error => {
    dispatch({
      type: apiTypes.FAILURE,
      payload: error,
      key: apiAction.key,
      isLogin: apiAction.isLogin,
    });
  });
}