import { apiActionBuilder, apiRestBuilder, apiLoginBuilder, apiProfileBuilder } from '../src';

export const demoApi = (page) => apiActionBuilder('pages', `http://echo.jsontest.com/page/${page}`, 'djdjdjdj');
export const userApi = () => apiActionBuilder('users', `http://192.168.1.30:3000/api/users`, 'djdjdjeedj');

export const loginApi = (username, password) => apiLoginBuilder(`http://192.168.1.30:3000/auth/login?username=${username}&password=${password}`, 'ewsesd', {});
export const profileApi = () => apiProfileBuilder(`http://192.168.1.30:3000/api/me`);

export const queryClient = (query) => apiRestBuilder('clients', `http://192.168.1.30:3000/api/clients`, null, 'ewmjdd', {});
export const queryCountry = (query) => apiRestBuilder('countries', `http://192.168.1.30:3000/api/geocountries`, 'list');
