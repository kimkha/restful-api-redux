// Export modules
import { API_ACTION_TYPE, API_REDUX_KEY } from './constants'
import apiMiddleware from './middleware'
import { apiReducer, initialState } from './reducer'

export { API_ACTION_TYPE, API_REDUX_KEY }
export { apiMiddleware }
export { apiReducer }

// Main functions
export const apiActionBuilder = (key, url, options = {}) => ({
  [API_ACTION_TYPE]: {
    key,
    endpoint: url,
    fetchOptions: options,
  },
});

export const apiLoginBuilder = (url, options = {}, tokenConverter = tk => tk) => ({
  [API_ACTION_TYPE]: {
    key: 'login',
    endpoint: url,
    fetchOptions: options,
    isLogin: true,
    tokenConverter,
  },
});

/**
 * Get state of an API
 * @param state
 * @param key
 * @return current state, format: { isLoading, response, error }
 */
export const convertApiState = (state, key) => (state && state[API_REDUX_KEY] && state[API_REDUX_KEY][key]) || initialState;
