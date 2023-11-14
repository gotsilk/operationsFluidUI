import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {DataSourceI, TableI} from '../../interfaces/commonInterfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSourceNames} from '../../constants';
import {CommonService} from '../../services/common.service';
import {CommonViewAllTablesUtils} from '../../utils/CommonViewAllTablesUtils';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {RoutingChangeService} from '../../services/routing-change.service';
import {CATEGORY1} from '../../TableDetails';

@Component({
  selector: 'app-view-fare-tables',
  templateUrl: './view-category2-tables.component.html',
  styleUrls: ['./view-category2-tables.component.css']
})
@AutoUnsubscribe()
export class ViewCategory2TablesComponent extends CommonViewAllTablesUtils {


  items: MenuItem[];
  dataSource!: DataSourceI;
  dataSourceNames = DataSourceNames;

  constructor(public override router: Router, public override route: ActivatedRoute, public override service: CommonService,
              public override routingService: RoutingChangeService) {
    super(router, route, service, routingService);
    this.items = [];
    for (const sutabledetailsKey of CATEGORY1) {
      const table: TableI = sutabledetailsKey;
      const text = table.name;
      const result = text.replace(/([A-Z])/g, ' $1');
      const finalResult = (result.charAt(0).toUpperCase() + result.slice(1)).trim();
      const item: MenuItem = {label: finalResult, routerLink: `${table.name[0].toLowerCase() + table.name.substring(1)}`, icon: table.icon};
      this.items.push(item);
      this.items = this.sortAlpha(this.items);
    }
    this.subForChildRouteChanges(this.items);
    this.subForFluidTableEvent();
  }
}
