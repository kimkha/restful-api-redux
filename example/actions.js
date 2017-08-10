import { apiActionBuilder } from '../src';

export const demoApi = (page) => apiActionBuilder('pages', `http://echo.jsontest.com/page/${page}`);

