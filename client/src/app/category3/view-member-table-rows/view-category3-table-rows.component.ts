import {Component, OnInit} from '@angular/core';
import {DataSourceI, TableDetailConstI, TableI} from '../../interfaces/commonInterfaces';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../modals/modal.service';
import {CommonService} from '../../services/common.service';
import {DataSourceNames} from '../../constants';
import { CATEGORY2} from '../../TableDetails';
import {Category3ApiService} from '../category3-api.service';
import {SuMessageService} from '../../services/su-message.service';
import {Utilities} from '../../utils/Utilities';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {DataSourceService} from '../../services/data-source.service';
import {Subscription} from 'rxjs';
import {TableOverviewBase} from '../../components/table-overview/table-overview.base';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-view-member-table-rows',
  templateUrl: '../../commonTemplates/table-view.html',
  styleUrls: ['./view-category3-table-rows.component.scss']
})
@AutoUnsubscribe()
export class ViewCategory3TableRowsComponent extends TableOverviewBase implements OnInit {

  override dataSourceName: string;
  override init: any;
  override tableConst: TableDetailConstI;
  bulkBlackList: string[];
  utilities: Utilities;
  dbSub!: Subscription;
  override initializing: boolean;

  constructor(public override dataSourceRest: Category3ApiService, public override spinner: NgxSpinnerService,
              public override router: Router, public override rest: ApiService,
              public override route: ActivatedRoute, public override message: SuMessageService,
              public override modals: ModalService, public override service: CommonService,
              public override dataSourceService: DataSourceService) {
    super(spinner, router, rest, route, message, modals, service, dataSourceRest, dataSourceService);
    this.dataSourceName = DataSourceNames.DATA_SOURCE_MEMBER;
    this.utilities = new Utilities();
    this.initializing = false;
    // @ts-ignore
    const path = this.route.url.getValue()[0].path;
    // @ts-ignore
    this.tableConst = CATEGORY2.find((it: TableI) => it.name.toLowerCase() === path.toLowerCase());
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
