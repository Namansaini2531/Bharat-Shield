/**
 * Centralized API configuration for Bharat-Shield Sentinel.
 * Works seamlessly across Web and Desktop (Tauri) environments.
 */

export const isDesktopApp = () => {
  return typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__);
};

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__BHARAT_SHIELD_API_URL__) {
    return window.__BHARAT_SHIELD_API_URL__;
  }
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
};

export const getWsBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__BHARAT_SHIELD_WS_URL__) {
    return window.__BHARAT_SHIELD_WS_URL__;
  }
  return import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000';
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();
