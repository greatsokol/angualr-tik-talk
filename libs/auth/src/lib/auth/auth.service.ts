import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthPayload, TokenResponse} from './auth.interface';
import {catchError, tap, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {baseUrl} from "@tt/globals";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private cookieService: CookieService = inject(CookieService);

  private _token?: string;
  private _refreshToken?: string;

  get token(): string {
    if (!this._token) {
      this._token = this.cookieService.get('token');
    }
    return this._token;
  }

  get refreshToken(): string {
    if (!this._refreshToken) {
      this._refreshToken = this.cookieService.get('refresh_token');
    }
    return this._refreshToken;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  login(payload: AuthPayload) {
    const formData = new FormData();
    formData.append('username', payload.username);
    formData.append('password', payload.password);
    return this.http
      .post<TokenResponse>(`${baseUrl}auth/token`, formData)
      .pipe(tap((data) => this.saveToken(data)));
  }

  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${baseUrl}auth/refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((data) => this.saveToken(data)),
        catchError((err) => {
          this.logout();
          return throwError(err);
        })
      );
  }

  logout() {
    this._token = undefined;
    this._refreshToken = undefined;
    this.cookieService.delete('token', '/');
    this.cookieService.delete('refresh_token', '/');
    this.router.navigate(['/login']);
  }

  saveToken(data: TokenResponse) {
    this._token = data.access_token;
    this._refreshToken = data.refresh_token;
    this.cookieService.set('token', data.access_token, {path: '/'});
    this.cookieService.set('refresh_token', data.refresh_token, {path: '/'});
  }
}
