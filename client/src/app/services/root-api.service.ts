import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RootApiService {

  constructor(public http: HttpClient, public router: Router) { }

  getHeaders(): HttpHeaders{
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  post(uri: string, rq: any): Promise<any>{
    return firstValueFrom(this.http.post(`${environment.serverUrl}${uri}`, rq, { headers : this.getHeaders()}));
  }

  get(uri: string): Promise<any>{
    return firstValueFrom(this.http.get(`${environment.serverUrl}${uri}`, { headers : this.getHeaders()}));
  }
}
