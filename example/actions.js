import { apiActionBuilder, apiRestBuilder, apiLoginBuilder } from '../src';

export const demoApi = (page) => apiActionBuilder('pages', `http://echo.jsontest.com/page/${page}`);
export const userApi = () => apiActionBuilder('users', `http://192.168.1.30:3000/api/users`);

export const loginApi = (username, password) => apiLoginBuilder(`http://192.168.1.30:3000/auth/login?username=${username}&password=${password}`, {});

export const queryClient = (query) => apiRestBuilder('clients', `http://192.168.1.30:3000/api/clients`, {});

