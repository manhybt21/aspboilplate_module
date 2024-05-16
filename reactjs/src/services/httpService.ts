import AppConsts from './../lib/appconst'
import { L } from '../lib/abpUtility'
import { Modal } from 'antd'
import axios from 'axios'
import Cookies from 'js-cookie'
const qs = require('qs')
//import abp from '../lib/abp';
//declare var abp: any;

const http = axios.create({
  baseURL: AppConsts.remoteServiceBaseUrl,
  timeout: 30000,
  paramsSerializer: function (params) {
    return qs.stringify(params, {
      encode: false,
    })
  },
})

http.interceptors.request.use((config) => {
  const token = Cookies.get('Abp.AuthToken')
  const cookieLangValue = Cookies.get('Abp.Localization.CultureName')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers.set('Abp.TenantId', Cookies.get('Abp.TenantId') ?? 'null')
  if (cookieLangValue && config.headers && !config.headers.has('Accept-Language')) {
    config.headers.set('Accept-Language', cookieLangValue)
  }
  if (cookieLangValue && config.headers && !config.headers.has('.AspNetCore.Culture')) {
    config.headers.set('.AspNetCore.Culture', cookieLangValue)
  }
  config.headers['Content-Type'] = 'application/json'
  config.headers.Accept = 'text/plain'
  config.headers.set('X-Requested-With', 'XMLHttpRequest')
  return config
})

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message &&
      error.response.data.error.details
    ) {
      Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
      })
    } else if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message
    ) {
      Modal.error({
        title: L('LoginFailed'),
        content: error.response.data.error.message,
      })
    } else if (!error.response) {
      Modal.error({ content: L('UnknownError') })
    }

    setTimeout(() => {}, 1000)

    return Promise.reject(error)
  }
)

export default http
