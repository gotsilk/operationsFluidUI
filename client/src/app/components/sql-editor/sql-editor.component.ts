import { Component } from '@angular/core';
import 'codemirror/mode/sql/sql';

import {ColDef, ColumnApi, GridApi, GridOptions} from 'ag-grid-community';
import {ApiService} from '../../services/api.service';
import {DataSourceService} from '../../services/data-source.service';
import {DataSourceI} from '../../interfaces/commonInterfaces';


@Component({
  selector: 'app-sql-editor',
  templateUrl: './sql-editor.component.html',
  styleUrls: ['./sql-editor.component.scss']
})
export class SqlEditorComponent {

  savedData: string|null;
  sqlModel: any;
  options: any;
  results: any;
  columnDefs: ColDef[];
  gridOptions!: GridOptions;
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;


  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code = 'function x() {\nconsole.log("Hello world!");\n}';

  constructor(public rest: ApiService, public dataService: DataSourceService) {
    this.savedData = localStorage.getItem('SUOPS_SAVEDSQL');
    this.options = {
      lineNumbers: true,
      theme: 'material',
      mode: 'sql'
    };
    this.gridOptions = {
      animateRows: true,
      defaultColDef: {
        floatingFilter: true,
        filter: true,
        sortable: true,
        resizable: true
      }
    };
    this.columnDefs = [];
  }

  async execute(): Promise<any>{
    const dataSource = await this.getDataSource();
    this.results = null;
    const rq = {
      dataSource: dataSource.name,
      sql: this.sqlModel
    };
    const r = await this.rest.executeSql(rq);
    if (r) {
      this.columnDefs = [];
      const firstOne = r[0];
      for (const h in firstOne){
        if (firstOne.hasOwnProperty(h)){
          this.columnDefs.push({headerName: h, field: h, sortable: true});
        }
      }
      this.results = r;
    }
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }


  async getDataSource(): Promise<any>{
    return new Promise((resolve, reject) => {
      const lastDataSource: DataSourceI|null = this.dataService.getLastRecordedDataSource();
      if (lastDataSource){
        resolve(lastDataSource);
      }else {
        this.dataService.$lastDataSourceData.subscribe((data) => {
          if (data){
            resolve(data.name);
          }
        }).unsubscribe();
      }
    });
  }

}
