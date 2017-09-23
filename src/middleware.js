import { API_ACTION_TYPE } from './constants';
import { fetchJson } from './internals/fetch';
import { toTypes } from './internals/types';
import { removeToken, saveToken } from './internals/token';

const asyncRequest = async (apiAction, dispatch) => {
  const apiTypes = toTypes(apiAction.key);

  dispatch({
    type: apiTypes.LOADING,
    key: apiAction.key,
    isLogin: apiAction.isLogin,
    isLogout: apiAction.isLogout,
    isRest: apiAction.isRest,
    group: apiAction.group,
    trackingId: apiAction.trackingId,
  });

  try {
    const { json } = await fetchJson(apiAction.endpoint, apiAction.fetchOptions);

    if (apiAction.isLogin) {
      await saveToken(apiAction.tokenConverter(json));
    } else if (apiAction.isLogout) {
      await removeToken();
    }

    dispatch({
      type: apiTypes.SUCCESS,
      payload: json,
      key: apiAction.key,
      isLogin: apiAction.isLogin,
      isLogout: apiAction.isLogout,
      isRest: apiAction.isRest,
      group: apiAction.group,
      shouldAppend: apiAction.shouldAppend,
      trackingId: apiAction.trackingId,
    });

    return json;
  } catch (error) {
    console.log(error);

    dispatch({
      type: apiTypes.FAILURE,
      payload: error,
      key: apiAction.key,
      isLogin: apiAction.isLogin,
      isLogout: apiAction.isLogout,
      isRest: apiAction.isRest,
      group: apiAction.group,
      trackingId: apiAction.trackingId,
    });
  }
};

export default ({ dispatch }) => next => action => {
  const apiAction = action[ API_ACTION_TYPE ];

  // Ignore non-API actions.
  if (typeof apiAction !== 'object') {
    return next(action);
  }

  return asyncRequest(apiAction, dispatch);
}