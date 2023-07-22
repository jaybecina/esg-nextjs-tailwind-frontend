import axios from 'axios';
import { get } from 'lodash';

const BaseAPI = process.env.REACT_APP_API_URL;

const service = axios.create({
  baseURL: BaseAPI,
  timeout: 120000
});

service.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('jll-token');
    const newConfig = config;
    if (typeof token !== 'undefined') {
      newConfig.headers['Authorization'] = `Bearer ${token}`;
    }
    return newConfig;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    console.log({ error });
    const res: any = get(error, 'response.data', { message: '', status: '' });

    if (res.message === 'token invalid' && res.status === 'error') {
      localStorage.removeItem('token');
      // window.location.reload();
    }
    return Promise.reject(error.response);
  }
);

export default service;
