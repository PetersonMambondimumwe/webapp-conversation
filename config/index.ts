import type { AppInfo } from '@/types/app'
const cleanEnv = (key: string, fallback = '') => {
  const val = process.env[key]
  if (!val || val === 'undefined' || val === 'null') return fallback
  let trimmed = val.trim()
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    trimmed = trimmed.slice(1, -1).trim()
  }
  return trimmed || fallback
}

export const APP_ID = cleanEnv('NEXT_PUBLIC_APP_ID') || cleanEnv('APP_ID')
export const API_KEY = cleanEnv('NEXT_PUBLIC_APP_KEY') || cleanEnv('APP_KEY')

const rawApiUrl = cleanEnv('NEXT_PUBLIC_API_URL') || cleanEnv('API_URL')
export const API_URL = (() => {
  if (!rawApiUrl) return 'https://api.dify.ai/v1'
  let url = rawApiUrl
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }
  return url.replace(/\/+$/, '')
})()
export const APP_INFO: AppInfo = {
  title: 'Chat APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'en',
  disable_session_same_site: false, // set it to true if you want to embed the chatbot in an iframe
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
