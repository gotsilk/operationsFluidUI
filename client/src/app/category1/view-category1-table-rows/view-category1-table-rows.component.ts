import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';

import {ModalService} from '../../modals/modal.service';
import {CommonService} from '../../services/common.service';
import {DataSourceNames} from '../../constants';
import {CATEGORY3} from '../../TableDetails';
import {TableDetailConstI, TableI} from '../../interfaces/commonInterfaces';
import {Category1ApiService} from '../category1-api.service';
import {SuMessageService} from '../../services/su-message.service';
import {Utilities} from '../../utils/Utilities';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {DataSourceService} from '../../services/data-source.service';
import {Subscription} from 'rxjs';
import {TableOverviewBase} from '../../components/table-overview/table-overview.base';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-view-error-table-rows',
  templateUrl: '../../commonTemplates/table-view.html',
  styleUrls: ['./view-category1-table-rows.component.scss']
})
@AutoUnsubscribe()
export class ViewCategory1TableRowsComponent extends TableOverviewBase implements OnInit {

  override dataSourceName: string;
  override init: any;
  override tableConst: TableDetailConstI;
  bulkBlackList: string[];
  utilities: Utilities;
  dbSub!: Subscription;
  override initializing: boolean;

  constructor(public override dataSourceRest: Category1ApiService, public override spinner: NgxSpinnerService,
              public override router: Router, public override rest: ApiService, public override route: ActivatedRoute,
              public override message: SuMessageService, public override modals: ModalService,
              public override service: CommonService, public override dataSourceService: DataSourceService) {
    super(spinner, router, rest, route, message, modals, service, dataSourceRest, dataSourceService);
    this.dataSourceName = DataSourceNames.DATA_SOURCE_FARE;
    this.utilities = new Utilities();
    this.initializing = false;

    // @ts-ignore todo fix this probs
    const path = this.route.url.getValue()[0].path;
    // @ts-ignore
    this.tableConst = CATEGORY3.find((i: TableI) => i.name.toLowerCase() === path.toLowerCase());
    this.bulkBlackList = [this.tableConst.idColName];
    this.colStateName = `${this.tableConst.name}_GRID_STATE`;
    this.subForDatabaseChange();
  }

  ngOnInit(): void{
    this.initialize();
  }

  subForDatabaseChange(): void {
    this.dbSub = this.dataSourceService.$dataSource.subscribe((ds) => {
      if (ds && ds.type === this.dataSourceName){
        this.initialize();
      }
    });
  }
}
