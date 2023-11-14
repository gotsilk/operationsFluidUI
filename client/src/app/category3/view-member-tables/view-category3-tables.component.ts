/* tslint:disable:no-string-literal */
import { Component, OnInit } from '@angular/core';
import {CommonViewAllTablesUtils} from '../../utils/CommonViewAllTablesUtils';
import {MenuItem} from 'primeng/api';
import {DataSourceI, TableDetailConstI, TableI} from '../../interfaces/commonInterfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {RoutingChangeService} from '../../services/routing-change.service';
import {CATEGORY1, CATEGORY2} from '../../TableDetails';
import { DataSourceNames } from 'src/app/constants';

@Component({
  selector: 'app-view-member-tables',
  templateUrl: './view-category3-tables.component.html',
  styleUrls: ['./view-category3-tables.component.scss']
})
export class ViewCategory3TablesComponent extends CommonViewAllTablesUtils {


  items: MenuItem[];
  dataSource!: DataSourceI;
  dataSourceNames = DataSourceNames;

  constructor(public override router: Router, public override route: ActivatedRoute, public override service: CommonService,
              public override routingService: RoutingChangeService) {
    super(router, route, service, routingService);
    this.items = [];
    for (const sutabledetailsKey of CATEGORY2) {
      const table: TableI = sutabledetailsKey;
      const text = table.name;
      const result = text.replace(/([A-Z])/g, ' $1');
      const finalResult = (result.charAt(0).toUpperCase() + result.slice(1)).trim();
      const item: MenuItem = {label: finalResult, routerLink: `${table.name[0].toLowerCase() + table.name.substring(1)}`, icon: table.icon};
      this.items.push(item);
      this.items = this.sortAlpha(this.items);
    }
    this.subForChildRouteChanges(this.items);
  }
}
