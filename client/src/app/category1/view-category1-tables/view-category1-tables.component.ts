import { Component } from '@angular/core';
import {CommonViewAllTablesUtils} from '../../utils/CommonViewAllTablesUtils';
import {MenuItem} from 'primeng/api';
import {DataSourceI } from '../../interfaces/commonInterfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {RoutingChangeService} from '../../services/routing-change.service';
import {CATEGORY3} from '../../TableDetails';
import {DataSourceNames} from '../../constants';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';

@Component({
  selector: 'app-view-error-tables',
  templateUrl: '../../commonTemplates/standardViewTablesView.html',
  styleUrls: ['./view-category1-tables.component.scss']
})
@AutoUnsubscribe()
export class ViewCategory1TablesComponent extends CommonViewAllTablesUtils{


  items: MenuItem[];
  dataSource!: DataSourceI;
  dataSourceNames = DataSourceNames;

  constructor(public override router: Router, public override route: ActivatedRoute, public override service: CommonService,
              public override routingService: RoutingChangeService) {
    super(router, route, service, routingService);
    this.items = [];
    for (const sutabledetailsKey of CATEGORY3) {
      const text = sutabledetailsKey.name;
      const result = text.replace(/([A-Z])/g, ' $1');
      const finalResult = (result.charAt(0).toUpperCase() + result.slice(1)).trim();
      const item: MenuItem = {label: finalResult, routerLink: `${sutabledetailsKey.name[0].toLowerCase() + sutabledetailsKey.name.substring(1)}`, icon: sutabledetailsKey.icon};
      this.items.push(item);
      this.items = this.sortAlpha(this.items);
    }
    this.subForChildRouteChanges(this.items);
  }
}
