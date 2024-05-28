import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth/auth.service';

@Injectable()
export class CallsInterceptor implements HttpInterceptor {
  authService = inject(AuthService);

  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //   return this.authService.user.pipe(
    //     take(1),
    //     exhaustMap((user) => {
    //       if (!user) {
    //         return next.handle(request);
    //       }

    //       const modifiedReq = request.clone({
    //         params: new HttpParams().set('auth', user.token as string),
    //       });

    //       return next.handle(modifiedReq);
    //     })
    //   );
    // }
    return next.handle(request);
  }
}
