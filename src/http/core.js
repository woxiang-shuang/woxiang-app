import axios, { CancelToken } from 'axios';
import qs from 'qs';
import { getServerHost, curEvn, EVN_DEV } from '../../config';
import RequestQueue from './requestQueue';
import { Toast } from '@ant-design/react-native';
import { enptyFn } from '../utils/common';

const SERVER_HOST = getServerHost();

const IS_DEBUG = false; // curEvn === EVN_DEV;

// let PROXY_PREFIX = process.env.NODE_ENV === 'development' ? '/' : '/';

const emptyFn = () => {};

let requestQueue = new RequestQueue();

function addProxyPrefix(url) {
  if (/^https?:\/\/.+$/.test(url)) return url;
  url = SERVER_HOST + url;
  return url;
}

function urlStringify(url = '', params = {}) {
  if (Object.keys(params).length > 0) {
    url += (url.indexOf('?') > 0 ? '&' : '?') + qs.stringify(params);
  }
  return url;
}

function debugInfo(info, arg) {
  console.log('info req:', JSON.stringify(info || {}), arg);
}

async function delayFn(millonSeconds = 10000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('delay');
    }, millonSeconds);
  });
}

axios.defaults.timeout = 20000;

// Add a request interceptor
axios.interceptors.request.use(function(config) {
  config.url = addProxyPrefix(config.url);
  // console.log('interceptors.request url queue=', requestQueue.queue);
  // console.log('url----------', config.url);
  if (config.method === 'post') {
    // 当数据为raw时，不对数据做任何操作
    if(!config.isRaw) {
      config.data = qs.stringify(config.data);
    }
    // console.log('config.data----------', config.data,);
  } else if (config.method === 'get' && config.filter !== false) {
    // const url = urlStringify(config.url, config.params);
    // if (requestQueue.has(url)) {
    //   requestQueue.remove(url);
    //   // console.log('interceptors.request url queue 1=', requestQueue.queue);
    //   // return Promise.reject({'type': 'request frequently'});
    // } else {
    //   requestQueue.add(url);
    // }
  }

  if (!config.cancelToken) {
    let cancelToken = CancelToken.source();
    setTimeout(() => {
      cancelToken.cancel('TIMEOUT');
    }, axios.defaults.timeout);
    config.cancelToken = cancelToken.token;
  }

  if (IS_DEBUG) {
    debugInfo(config);
  }

  return config;
}, function(error) {
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function(response) {
  // console.log('response-----',response);
  stateCapture(response);
  response = response?.data || {}; 
  return response;
}, function(error) {
  // console.log('response------err', error);
  // Do something with response error
  return Promise.reject(error);
});

export function isTimeout(res = {}) {
  return res.code === 'ECONNABORTED' || res.message === 'TIMEOUT';
}

export function isNetworkError(res = {}) {
  return res.message === 'Network Error';
}

export function processTimeout(res, fn = emptyFn) {
  if (isTimeout(res)) {
    fn(res);
  }
}

export function processNetworkException(res, fn = emptyFn) {
  if (isTimeout(res) || isNetworkError(res)) {
    fn(res);
  }
}

function stateCapture(response) {
  const responseCode = response?.data?.code || 200;
  // switch (responseCode) {
  // case 502:
  //   Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
  //   break;
  // case 404:
  //   Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
  //   break;
  // default:
  //   break;
  // }
}

export default axios;
