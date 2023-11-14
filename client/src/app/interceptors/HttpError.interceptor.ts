import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';


import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {SuMessageService} from '../services/su-message.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  static handleError(error: HttpErrorResponse): Observable<never> {
    if (error.message.includes('login/auth')) {
      const state = {
        state: window.location.pathname,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('SU_OPERS_STATE', JSON.stringify(state));
      window.location.reload();
    }

    if (error.status === 403){
      const msg = {
        statusCode: error.status,
        title : 'FORBIDDEN',
        msg: 'You do not have access to view this area'
      };
      return throwError(msg);
    }
    return throwError(error);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(HttpErrorInterceptor.handleError)
    );
  }
}
