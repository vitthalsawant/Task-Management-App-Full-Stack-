import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthResponse, User } from '../models/user.model';

const API_BASE_URL = 'https://task-management-app-full-stack.onrender.com';
const ACCESS_TOKEN_KEY = 'tm_access_token';
const REFRESH_TOKEN_KEY = 'tm_refresh_token';
const USER_KEY = 'tm_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.loadUser());

  constructor(private readonly http: HttpClient) {}

  isAuthenticated() {
    return !!this.getAccessToken();
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  login(params: { email: string; password: string }) {
    return this.http
      .post<{ success: boolean; message: string; data: AuthResponse }>(
        `${API_BASE_URL}/auth/login`,
        params,
      )
      .pipe(tap((res) => this.persistAuth(res.data)));
  }

  register(params: { email: string; password: string; name: string }) {
    return this.http
      .post<{ success: boolean; message: string; data: AuthResponse }>(
        `${API_BASE_URL}/auth/register`,
        params,
      )
      .pipe(tap((res) => this.persistAuth(res.data)));
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.user.set(null);
  }

  private persistAuth(data: AuthResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this.user.set(data.user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}

