import {Component} from '@angular/core';
import {ColDef, ColumnApi, GridApi} from 'ag-grid-community';
import {CATEGORY3, CATEGORY1, CATEGORY2} from '../../TableDetails';
import {DataSourceTypes} from '../../constants';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-table-lookup',
  templateUrl: './table-lookup.component.html',
  styleUrls: ['./table-lookup.component.scss']
})
export class TableLookupComponent {

  tableList: any[];
  columnDefs: ColDef[];
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;

  constructor(private router: Router, public dialogRef: MatDialogRef<TableLookupComponent>) {
    this.tableList = [];
    for (const i of CATEGORY1){
      const tableDeet = {tableName: i.name, source: DataSourceTypes.FARE};
      this.tableList.push(tableDeet);
    }
    for (const i of CATEGORY2){
      const tableDeet = {tableName: i.name, source: DataSourceTypes.MEMBER};
      this.tableList.push(tableDeet);
    }
    for (const i of CATEGORY3){
      const tableDeet = {tableName: i.name, source: DataSourceTypes.Error};
      this.tableList.push(tableDeet);
    }


    this.columnDefs = [
      { headerName: 'table name', field: 'tableName', filter: 'text', floatingFilter: true},
      { headerName: 'source', field: 'source', filter: 'text', floatingFilter: true}
    ];

  }

  nav(event: any): void {
    const route = event.data.tableName[0].toLowerCase() + event.data.tableName.substring(1);
    this.router.navigateByUrl(`${event.data.source}/${route}`);
    this.dialogRef.close();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }
}
