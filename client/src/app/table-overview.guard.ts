import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {ApiService} from './services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TableOverviewGuard implements CanActivate {

  constructor(public api: ApiService,  private router: Router) {  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isPermitted(route, state).then((stat) => {
      if (stat){
        return true;
      }else {
        this.router.navigate(['/access-denied']);
      }
      return false;
    });
  }

  async isPermitted(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot): Promise<boolean> {
    const routeType: any = route.routeConfig?.path;
    const res = await this.api.isUserPermitted(routeType);
    return !!res.status;
  }

}
