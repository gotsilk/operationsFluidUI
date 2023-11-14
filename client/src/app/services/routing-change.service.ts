import { Injectable } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingChangeService {

  constructor(public router: Router, public route: ActivatedRoute, private service: CommonService) {
    this.init();
  }

  static currentChild: string;
  static currentRoot: string;


  private childRouteData = new BehaviorSubject(null);
  $childRouteChange = this.childRouteData.asObservable();

  private parentRouteData = new BehaviorSubject(null);
  $parentRouteChange = this.parentRouteData.asObservable();

  private tableDetailStateData = new BehaviorSubject(null);
  $enterTableDetailsState = this.tableDetailStateData.asObservable();

  private detailsView = new BehaviorSubject(false);
  $detailsView = this.detailsView.asObservable();



  updateData(dataType: BehaviorSubject<any>, newValue: any): void {
    dataType.next(newValue);
  }

  getCurrentChildRoute(): string {
    return RoutingChangeService.currentChild;
  }

  watchForRoutingEndChanges(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlSegs: string[] = event.url.split('/');
        const root = urlSegs[1];

        this.updateData(this.parentRouteData, root);
        RoutingChangeService.currentRoot = root;
        this.service.showChangeHeader(false);

        let child = null;
        if (urlSegs.length > 2) {
          child = urlSegs[2];
          this.updateData(this.childRouteData, child);
          RoutingChangeService.currentChild = child;
          this.service.showChangeHeader(true);
        }

        let detailsState = false;
        if (urlSegs.length > 3) {
          detailsState = true;
          this.updateData(this.tableDetailStateData, detailsState);
          this.service.showChangeHeader(false);
        }

        // watch to see if in row details view
        if (urlSegs.filter(x => x.toLocaleLowerCase().includes('details')).length > 0){
          this.updateData(this.detailsView, true);
        }else {
          this.updateData(this.detailsView, false);
        }

      }
    });
  }

  init(): void {
    this.watchForRoutingEndChanges();
  }
}
