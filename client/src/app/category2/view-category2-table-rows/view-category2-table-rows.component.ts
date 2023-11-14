import {Component, OnInit} from '@angular/core';
import {DataSourceNames} from '../../constants';
import {Category2ApiService} from '../category2-api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../modals/modal.service';
import {CommonService} from '../../services/common.service';
import {DataSourceI, TableDetailConstI, TableI} from '../../interfaces/commonInterfaces';
import {CATEGORY1} from '../../TableDetails';
import {SuMessageService} from '../../services/su-message.service';
import {Utilities} from '../../utils/Utilities';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {DataSourceService} from '../../services/data-source.service';
import {Subscription} from 'rxjs';
import {TableOverviewBase} from '../../components/table-overview/table-overview.base';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-view-fare-table-rows',
  templateUrl: '../../commonTemplates/table-view.html',
  styleUrls: ['./view-category2-table-rows.component.scss']
})
@AutoUnsubscribe()
export class ViewCategory2TableRowsComponent extends TableOverviewBase implements OnInit {

  override dataSourceName: string;
  override init: any;
  override tableConst: TableDetailConstI;
  bulkBlackList: string[];
  utilities: Utilities;
  dbSub!: Subscription;
  override initializing: boolean;

  constructor(public override dataSourceRest: Category2ApiService, public override spinner: NgxSpinnerService,
              public override router: Router, public override rest: ApiService, public override route: ActivatedRoute,
              public override message: SuMessageService, public override modals: ModalService, public override service: CommonService,
              public override dataSourceService: DataSourceService) {
    super(spinner, router, rest, route, message, modals, service, dataSourceRest, dataSourceService);
    this.dataSourceName = DataSourceNames.DATA_SOURCE_FARE;
    this.initializing = false;
    this.utilities = new Utilities();
    // @ts-ignore
    const path = this.route.url.getValue()[0].path;
    // @ts-ignore
    this.tableConst = CATEGORY1.find((it: TableI) => it.name.toLowerCase() === path.toLowerCase());
    this.bulkBlackList = [this.tableConst.idColName];
    this.colStateName = `${this.tableConst.name}_GRID_STATE`;
    this.subForDatabaseChange();
  }

  ngOnInit(): void{
    this.initialize();
  }

  subForDatabaseChange(): void {
    this.dbSub = this.dataSourceService.$dataSource.subscribe((ds: DataSourceI| null) => {
      if (ds && ds.type === this.dataSourceName){
        this.initialize();
      }
    });
  }
}
