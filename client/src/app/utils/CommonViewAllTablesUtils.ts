import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../services/common.service';
import {MenuItem} from 'primeng/api';
import {RoutingChangeService} from '../services/routing-change.service';
import {Subscription} from 'rxjs';


export class CommonViewAllTablesUtils {

  currentTable!: string;
  showSide!: boolean;
  activeItem!: MenuItem;
  hideHeaders: boolean;
  childSub!: Subscription;
  fluidTableSub!: Subscription;

  constructor(public router: Router, public route: ActivatedRoute, public service: CommonService,
              public routingService: RoutingChangeService){
    this.hideHeaders = true;
  }



  navToNewItem(item: MenuItem): void{
    this.router.navigate([`./${item.routerLink}/details`, 'new'], {relativeTo: this.route}).then(() => {
      this.showSide = false;
    }).catch(e => {
        console.log('there is no route');
      }
    );
  }

  getCurrentMenuItem(menuItemLabel: any, items: any): MenuItem{
    // @ts-ignore
    return items.find(item => {
      if (item.routerLink) {
       return item.routerLink.replace('./', '') === menuItemLabel;
      }
    });

  }

  subForChildRouteChanges(items: any): void{
    this.childSub = this.routingService.$childRouteChange.subscribe((childRouteName => {
      if (childRouteName){ // first could be null
        const menuItem: MenuItem = this.getCurrentMenuItem(childRouteName, items);
        if (menuItem){
          this.activeItem = menuItem;
        }
      }else {
        // @ts-ignore
        this.activeItem = null;
      }
    }));
  }

  subForFluidTableEvent(): any{
    this.fluidTableSub = this.service.$fluidTableNavEvent.subscribe((status => {
      if (status){
        this.service.navigateToFluidTableEvent(false);
        this.router.navigate(['./fluidTable'], {relativeTo: this.route});
      }
    }));
  }

  sortAlpha(list: MenuItem[]): MenuItem[] {
    // @ts-ignore
    list.sort((a: MenuItem, b: MenuItem) => a.label.localeCompare(b.label));
    return list;
  }

}
