import {Component, Inject, OnInit} from '@angular/core';
import {DataSourceI} from '../../interfaces/commonInterfaces';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataSourceNames, DataSourceTypes} from '../../constants';
import {ColDef, GridApi} from 'ag-grid-community';
import {DataSourceService} from '../../services/data-source.service';
import {AgCellDataSourceRendererComponent} from '../../ag-grid-components/ag-cell-data-source-renderer/ag-cell-data-source-renderer.component';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-data-source-modal',
  templateUrl: './data-source-modal.component.html',
  styleUrls: ['./data-source-modal.component.css']
})
export class DataSourceModalComponent implements OnInit {

  dbTypes: any[];
  active: any;
  init: boolean;
  fareDataSources: DataSourceI[];
  memberDataSources: DataSourceI[];
  errorDataSources: DataSourceI[];
  currentSources: DataSourceI[];
  private gridApi!: GridApi;
  private gridColumnApi!: any;
  hasSource!: boolean;
  columnDefs: ColDef[];
  frameworkComponents: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public rest: ApiService,
              public dialogRef: MatDialogRef<DataSourceModalComponent>, public dataService: DataSourceService) {

    this.init = false;
    this.fareDataSources = [];
    this.memberDataSources = [];
    this.errorDataSources = [];
    this.currentSources = [];
    this.dbTypes = [];
    this.dialogRef.disableClose = true;

    // tslint:disable-next-line:forin
    for (const dataSourceTypesKey in DataSourceTypes) {
      const item = {
        label: `${dataSourceTypesKey.valueOf()} Data sources`,
        command: (event: any) => {
          this.active = event.item;
          this.switchDataSources(event);
        }
      };
      if (!dataSourceTypesKey.toLowerCase().includes('global')){
        this.dbTypes.push(item);
      }
    }
    this.frameworkComponents = {
      dsRenderer: AgCellDataSourceRendererComponent
    };


    this.columnDefs = [
      {headerName: 'Name', field: 'name', sortable: true,
        cellRenderer: 'dsRenderer', filter: 'agTextColumnFilter',
        floatingFilter: true, lockPosition: true
      },
      {headerName: 'Url', field: 'url', sortable: true},
    ];
  }

  ngOnInit(): void {
    this.initialize();
    this.init = true;
  }

  chooseDataSource(event: any): void{
    const selectedDataSource: DataSourceI = event.data;
    selectedDataSource.type = this.determineDbType(event.data);
    this.dataService.dataSourceChanged(selectedDataSource);
    this.dialogRef.close(selectedDataSource);
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.refreshCells();
    params.api.sizeColumnsToFit();
  }

  determineDbType(dataSource: DataSourceI): any {
    if (dataSource.name.indexOf('member') > -1){
      return DataSourceNames.DATA_SOURCE_MEMBER;
    }
    if (dataSource.name.indexOf('fare') > -1){
      return DataSourceNames.DATA_SOURCE_FARE;
    }
    if (dataSource.name.indexOf('error') > -1){
      return DataSourceNames.DATA_SOURCE_ERROR;
    }
  }

  switchDataSources(event: any): void{
    const tabName = event.item.label.toLowerCase();
    if (tabName.includes('fareGlobal')){
      this.currentSources = this.fareDataSources;
    }else if (tabName.includes('fare')){
      this.currentSources = this.fareDataSources;
    }else if (tabName.includes('member')){
      this.currentSources = this.memberDataSources;
    }else if (tabName.includes('error')){
      this.currentSources = this.errorDataSources;
    }
    if (this.gridApi){
      this.gridApi.refreshCells();
    }

  }

  async initialize(): Promise<any>{
    const res =  await this.rest.getAllDataSources();
    res.forEach((item: DataSourceI) => {
      if (item.name.includes('fare')){
        this.fareDataSources.push(item);
      }
      else if (item.name.includes('member')){
        this.memberDataSources.push(item);
      }
      else if (item.name.includes('error')){
        this.errorDataSources.push(item);
      }
      else {
        console.error(`datasource was not categorized correctly... ${item}`);
      }
    });

    if (this.data && this.data.dst){
      this.active = this.dbTypes.find((i) => {
        if (i.label.toUpperCase().includes(this.data.dst.toUpperCase())){
          return i;
        }
      });
    }else {
      this.active = this.dbTypes[0];
    }
    const x = {
      item: this.active

    };
    this.switchDataSources(x);
  }
}
