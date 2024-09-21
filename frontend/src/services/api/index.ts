import axios from 'axios';
import { showError } from '../../utils/notify';
import { getDefaultStore } from 'jotai';
import { chainAtom } from '../../atoms/chain';
import { chainInfoMap } from '../../utils/env';
const store = getDefaultStore();

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    config.baseURL = chainInfoMap[store.get(chainAtom)].apiEndpoint + 'api';
    return config;
  },
  (error) => {
    showError(error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    showError(error.message);
    return Promise.reject(error);
  }
);

export default api;
