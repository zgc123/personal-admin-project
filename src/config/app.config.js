/*
 * @Description: 应用接口域名配置
 */

const VITE_ENV = import.meta.env;

/**
 * development: 开发 测试
 * devProduction: 开发 正式
 * test: 生产环境 正式
 * preProduction: 生产环境 预发布
 * production: 生产环境 正式
 */
export const VITE_APP_ENV = VITE_ENV.VITE_APP_ENV;

// 是否为开发环境
export const IS_DEV = VITE_ENV.DEV;

// 接口/业务数据 是否使用正式 域名/数据，
export const USE_PROD = ['devProduction', 'preProduction', 'production'].includes(VITE_APP_ENV)

// 业务接口域名
export const BASE_URL = VITE_ENV.VITE_BASE_URL;