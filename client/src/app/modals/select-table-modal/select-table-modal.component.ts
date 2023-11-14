import {Component, Injector, OnInit} from '@angular/core';
import {DataSourceNames, EditMode} from '../../constants';
import {Category3ApiService} from '../../category3/category3-api.service';
import {Category2ApiService} from '../../category2/category2-api.service';
import {Category1ApiService} from '../../category1/category1-api.service';
import {ApiServiceI} from '../../interfaces/api-serviceI';
import {ActivatedRoute, Router} from '@angular/router';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'su-select-table-modal',
  templateUrl: './select-table-modal.component.html',
  styleUrls: ['./select-table-modal.component.scss']
})
export class SelectTableModalComponent implements OnInit {

  mode: EditMode;
  rest: ApiServiceI;
  dbType: string;
  dataSourceName: string|undefined;
  tables: any[];
  selectedTable!: string;

  constructor(private route: ActivatedRoute, private router: Router, private injector: Injector, public ref: DynamicDialogRef ) {
    const urlSplit: string[] = this.router.url.split('/');
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
    this.tables = [];
  }

  async ngOnInit(): Promise<void> {
    const t = await this.rest.getTablesOnDataSource();
    t.forEach((item: string) => {
      this.tables.push({display: item, value: item});
    });
  }



  close(event: any): void {
    this.ref.close(event);
  }

}
