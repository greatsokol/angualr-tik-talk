import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError} from "rxjs";

var isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token: string | undefined = authService.token;
  if (!token || req.url.endsWith('/auth/refresh')) return next(req);

  if (isRefreshing$.value) {
    return refreshAndProceed(authService, req, next);
  }

  return next(addToken(req, token)).pipe(
    catchError(err => {
      console.log(err);
      if (err.status == 403) {
        return refreshAndProceed(authService, req, next);
      }
      return throwError(() => err);
    })
  );
};

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);
    return authService.refreshAuthToken().pipe(
      switchMap(data => {
        return next(addToken(req, data.access_token))
          .pipe(
            tap(_ => isRefreshing$.next(false))
          );
      })
    );
  }

  if (req.url.endsWith('/refresh')) return next(addToken(req, authService.token));

  return isRefreshing$.pipe(
    filter(isRefreshing => !isRefreshing),
    switchMap(_ => {
      return next(addToken(req, authService.token));
    })
  )
}

const addToken = (req: HttpRequest<unknown>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
