import { API_ACTION_TYPE } from './constants';
import { fetchJson } from './internals/fetch';
import { eventSource, closeEventSource } from './internals/eventsource';
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

const allEventSources = {};
const asyncEventSource = async (apiAction, dispatch) => {
  const apiTypes = toTypes(apiAction.key);
  try {
    if (allEventSources[apiAction.key]) {
      // Existing, stop it and re-init
      closeEventSource(allEventSources[apiAction.key]);
    }
    allEventSources[apiAction.key] = await eventSource(apiAction.endpoint, apiAction.fetchOptions, (data) => {
      dispatch({
        type: apiTypes.EVENTMSG,
        payload: data,
        key: apiAction.key,
        isEventSource: apiAction.isEventSource,
        receiveAt: +new Date(),
      }, () => {
        dispatch({
          type: apiTypes.FAILURE,
          payload: 'EventSource error',
          key: apiAction.key,
          isEventSource: apiAction.isEventSource,
        });
      });
    });
  } catch (error) {
    console.log(error);

    dispatch({
      type: apiTypes.FAILURE,
      payload: error,
      key: apiAction.key,
      isEventSource: apiAction.isEventSource,
    });
  }
};

export const stopEventSource = (key) => {
  if (allEventSources[key]) {
    closeEventSource(allEventSources[key]);
  }
};

export default ({ dispatch }) => next => action => {
  const apiAction = action[ API_ACTION_TYPE ];

  // Ignore non-API actions.
  if (typeof apiAction !== 'object') {
    return next(action);
  }

  if (apiAction.isEventSource) {
    return asyncEventSource(apiAction, dispatch);
  }

  return asyncRequest(apiAction, dispatch);
}