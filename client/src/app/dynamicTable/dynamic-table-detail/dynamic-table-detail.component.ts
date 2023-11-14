import {Component, Injector, OnInit} from '@angular/core';
import {ApiServiceI} from '../../interfaces/api-serviceI';
import {DataSourceNames, EditMode} from '../../constants';
import {Category3ApiService} from '../../category3/category3-api.service';
import {Category2ApiService} from '../../category2/category2-api.service';
import {Category1ApiService} from '../../category1/category1-api.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'su-dynamic-table-detail',
  templateUrl: './dynamic-table-detail.component.html',
  styleUrls: ['./dynamic-table-detail.component.scss']
})
export class DynamicTableDetailComponent implements OnInit {

  rest: ApiServiceI;
  init: boolean;
  mode: EditMode;
  dbType: string;
  dataSourceName!: DataSourceNames;
  tableNameKey = 'tableName';
  idKey = 'id';



  constructor(private router: Router, private route: ActivatedRoute, private injector: Injector) {
    this.init = false;
    const urlSplit: string[] = this.router.url.split('/'); // member/error/fare/etc first element is "" for some reason
    const key = 'mode';
    this.mode = this.route.snapshot.queryParams[key] as EditMode;
    this.dbType = urlSplit[1];
    switch (this.dbType){
      case 'member':
        this.rest = this.injector.get(Category3ApiService);
        this.dataSourceName = DataSourceNames.DATA_SOURCE_MEMBER;
        break;
      case 'fare' :
        this.rest = this.injector.get(Category2ApiService);
        this.dataSourceName = DataSourceNames.DATA_SOURCE_FARE;
        break;
      case 'error' :
        this.rest = this.injector.get(Category1ApiService);
        this.dataSourceName = DataSourceNames.DATA_SOURCE_ERROR;
        break;
      default:
        this.rest = this.injector.get(Category2ApiService);
    }
  }

  async ngOnInit(): Promise<void> {
    const rq = {
      tableName: this.route.snapshot.queryParams[this.tableNameKey],
      id: this.route.snapshot.queryParams[this.idKey]
    };

    const response: any = await this.rest.getDynamicTableRecordDetail(rq);
  }



}
