import { ADMIN_CREDENTIALS, AUTH_STORAGE_KEY } from '@/cms/defaults';

export function isAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function login(username: string, password: string): boolean {
  const valid =
    username.trim().toLowerCase() === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password;

  if (valid) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
  }

  return valid;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
