/**
 * API utility for Eunoia
 * Centralizes API URL construction with protocol normalization
 */

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Ensures the API URL always has a protocol prefix.
 * This prevents the browser from treating the URL as a relative path
 * when the protocol is accidentally omitted from an environment variable.
 */
export function getApiUrl(): string {
  // Remove trailing slash if present
  let url = RAW_API_URL.replace(/\/+$/, '');
  
  // If no protocol is specified, default to https
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  return url;
}

/**
 * Builds a full API endpoint URL for the given path.
 * @param path - The API path (e.g., "/auth/login")
 * @returns Fully qualified URL string
 */
export function apiUrl(path: string): string {
  const base = getApiUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}