import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SuMessageService} from '../../services/su-message.service';
import {ApiService} from '../../services/api.service';
import {DatePipe} from '@angular/common';
import {ModalService} from '../../modals/modal.service';
import {SuPropertiesService} from '../../services/su-properties.service';
import {DataSourceService} from '../../services/data-source.service';
import {DataSourceNames, EditMode} from '../../constants';
import {Category3ApiService} from '../../category3/category3-api.service';
import {Category2ApiService} from '../../category2/category2-api.service';
import {Category1ApiService} from '../../category1/category1-api.service';
import {ApiServiceI} from '../../interfaces/api-serviceI';
import {SelectTableModalComponent} from '../../modals/select-table-modal/select-table-modal.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {ColDef, ColumnApi, GridApi, GridOptions} from 'ag-grid-community';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {Subscription} from 'rxjs';
import {RowClickedEvent} from 'ag-grid-community/dist/lib/events';

@Component({
  selector: 'su-dynamic-table-list',
  templateUrl: './dynamic-table-list.component.html',
  styleUrls: ['./dynamic-table-list.component.scss']
})
@AutoUnsubscribe()
export class DynamicTableListComponent implements OnInit {

  mode: EditMode;
  rest: ApiServiceI;
  dbType: string;
  dataSourceName: string|undefined;
  tables!: string[];
  tableRecordsRS: any;
  colHeaders!: ColDef[];
  gridOptions: GridOptions;
  rows!: any[];
  init: boolean;
  style: any;
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  pkName!: string;
  modalSub!: Subscription;
  tableName!: string;

  constructor(public route: ActivatedRoute,  public message: SuMessageService,
              public commonRest: ApiService, public datePipe: DatePipe, public router: Router,
              public injector: Injector, public modals: ModalService, public suProperties: SuPropertiesService,
              public datasourceService: DataSourceService, private spinner: NgxSpinnerService) {
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

    this.gridOptions = {
      animateRows: true,
      valueCache: true,
      defaultColDef: {
      floatingFilter: true,
        filter: true,
        sortable: true,
        resizable: true
      }
    };
    this.style = {
      height: '400px',
      width: '100%'
    };
  }

  async ngOnInit(): Promise<void> {
    const config = {
      closeOnEscape: false,
      header: `Table to Query`,
      width: '20%',
      height: '50%'
    };
    this.modalSub = this.modals.openDynamicModal(SelectTableModalComponent, config).onClose.subscribe((result) => {
      this.tableName = result;
      if (result) {
        this.getTableData(result);
      }else {
        this.router.navigate(['../']);
      }
    });
  }

  async getTableData(tableName: string): Promise<any>{
    this.spinner.show();
    this.tableRecordsRS = await this.rest.getDynamicTableRecords(tableName);
    if (this.tableRecordsRS.success) {
      this.pkName = this.tableRecordsRS.pkName;
      this.setupTableHeaders(this.tableRecordsRS.colHeaders);
      this.rows = this.tableRecordsRS.data;
    }
    this.init = true;
    this.spinner.hide();
  }

  setupTableHeaders(headers: string[]): void{
    const limit = 5;
    let current = 0;
    this.colHeaders = [];

    this.colHeaders.push({headerName: this.pkName, field: this.pkName});

    headers.forEach((h: string) => {
      if (h === this.pkName){
        return;
      }
      current++;
      const head: ColDef = {headerName: h, field: h};
      if (current > limit) {
        head.hide = true;
      }
      this.colHeaders.push(head);
    });
  }

  goToDetails(event: RowClickedEvent): any{
    const id = event.data[this.pkName];
    this.router.navigate(['details'],
      {
        relativeTo: this.route,
        queryParams: {
          id,
          tableName: this.tableName
        }
      });
  }

  sizeUp(event: any): any{
    setTimeout(() => {
      const doc: any = document;
      const headerHeight = doc.getElementById('header').clientHeight;
      const dbTypeHeaders = doc.getElementById('dbTypeHeaders').clientHeight;
      const footerHeight = doc.getElementsByTagName('footer')[0].clientHeight;
      const heights = headerHeight + footerHeight + dbTypeHeaders; // tabMenuHeight
      const windowHeight = window.innerHeight;
      this.style.height = (windowHeight - heights - 50) + 'px';
      event.api.sizeColumnsToFit();
    });
  }

  onGridReady(event: any): any{
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;
  }

}
