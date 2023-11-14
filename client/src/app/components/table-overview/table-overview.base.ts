import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {ColDef, ColumnApi, CsvExportParams, GridApi, GridOptions, RowNode} from 'ag-grid-community';
import { Subscription} from 'rxjs';
import {ApplyColumnStateParams} from 'ag-grid-community/dist/lib/columns/columnApi';
import {DataSourceI, DomainStructureI, GetTableDataRqI, TableDetailConstI} from 'src/app/interfaces/commonInterfaces';
import {ApiService} from '../../services/api.service';
import {SuMessageService} from '../../services/su-message.service';
import {ModalService} from '../../modals/modal.service';
import {CommonService} from '../../services/common.service';
import {ApiServiceI} from '../../interfaces/api-serviceI';
import {DataSourceService} from '../../services/data-source.service';
import {AgCellDisplayComponent} from '../../ag-grid-components/ag-cell-display/ag-cell-display.component';
import {EditMode, SessionStorageKeys} from '../../constants';
import {CellClickedEvent} from 'ag-grid-community/dist/lib/events';
import {ColumnState} from 'ag-grid-community/dist/lib/columns/columnModel';


export abstract class TableOverviewBase {

  tableStructure!: DomainStructureI;
  visiRows!: any[];
  gridApi: GridApi|undefined;
  gridColumnApi!: ColumnApi;
  columnDefs!: ColDef[];
  rows!: any[];
  init!: boolean;
  csvSub!: Subscription;
  tableConst!: TableDetailConstI;
  dataSourceName!: string;
  changeHeaderSub!: Subscription;
  navStartEventSub!: Subscription;
  colStateName!: string;
  type: any = 'normal';
  initializing!: boolean;
  rawTableStructure: any;

  gridOptions: GridOptions = {
    animateRows: true,
    valueCache: true,
    defaultColDef: {
      floatingFilter: true,
      filter: true,
      sortable: true,
      resizable: true
    }
  };
  style: any = {
    height: '400px',
    width: '100%'
  };

  frameworkComponents: any;

  protected constructor(public spinner: NgxSpinnerService, public router: Router, public rest: ApiService,
                        public route: ActivatedRoute, public message: SuMessageService,
                        public modals: ModalService, public service: CommonService, public dataSourceRest: ApiServiceI,
                        public dataSourceService: DataSourceService) {

    this.service.closeSideMenu();
    this.frameworkComponents = {
      displayRenderer: AgCellDisplayComponent
    };
    this.service.showCreateMenu(true);
    this.subForCsvEvent();
  }


  applyColumnState(): void{
    const state = localStorage.getItem(this.colStateName);
    if (state && this.gridColumnApi && this.gridApi){
      const parsedState: ColumnState[] =  JSON.parse(state);
      const colStateParams: ApplyColumnStateParams = {
        state: parsedState
      };

      this.gridColumnApi.applyColumnState(colStateParams);

      // @ts-ignore
      const rawState: ColDef[] = this.gridApi.getColumnDefs();
      if (rawState){
        rawState.forEach((item: ColDef) => {
          item.width = undefined;
        });

        const rawStateOrdered: ColDef[] = [];
        // so stupid.. need to re-order this bc above ruins the order
        parsedState.forEach((parsedItem: ColumnState) =>{
          const found = rawState.find((f) =>{
            return f.colId === parsedItem.colId;
          });
          if (found){
            rawStateOrdered.push(found);
          }
        });

        this.columnDefs = rawStateOrdered as ColDef[];
      }
    }
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.applyColumnState();
    this.setFilterModel();
  }

  setColumnHeaders(tableStructure: DomainStructureI): ColDef[] {
    const colDefs: ColDef[] = [];
    const hardLimit = 8;
    let limit = 0;

    // put the ID first
    const colId = tableStructure.cols.find(x => x.isId);
    if (colId) {
      const agColId: ColDef = {
        headerName: colId.columnName,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        pinned: 'left',
        field: colId.columnName,
        cellRenderer: 'displayRenderer',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          textCustomComparator : this.textCustomComparator,
          suppressFilterButton: true
        },
        // onCellClicked: this.updateBulkEditRowsNew,
        hide: false
      };

      colDefs.push(agColId);
    }

    for (const col of tableStructure.cols) {
      if (col.columnName !== 'version' && !col.isId) {
        const colDef: ColDef = {
          headerName: col.columnName,
          field: col.columnName,
          sortable: true,
          suppressMenu: true,
          cellRenderer: 'displayRenderer',
          filter: 'agTextColumnFilter',
          valueGetter: this.customValueGetter,
          filterParams: {
            textCustomComparator : this.textCustomComparator,
            suppressFilterButton: true,
          },
          hide: false
        };
        if (limit > hardLimit) {
          colDef.hide = true;
        }
        limit++;
        colDefs.push(colDef);
      }
    }
    return colDefs;
  }

  sizeUp(params: any): void {
    setTimeout(() => {
      const doc: any = document;
      const batchHeight = doc.getElementById('batchForm').clientHeight;
      const headerHeight = doc.getElementById('header').clientHeight;
      const dbTypeHeaders = doc.getElementById('dbTypeHeaders').clientHeight;
      const footerHeight = doc.getElementsByTagName('footer')[0].clientHeight;
      const heights = batchHeight + headerHeight + footerHeight + dbTypeHeaders; // tabMenuHeight
      const windowHeight = window.innerHeight;
      this.style.height = (windowHeight - heights - 50) + 'px';
      params.api.sizeColumnsToFit();
      this.visiRows = params.api.getSelectedRows();
    });
  }

  subForOpenChangeHeader(): Subscription {
    return this.service.$openChangeHeader.subscribe((res) => {
      if (res) {
        this.modals.openChangeHeadersBottomSheet(this.rawTableStructure).subscribe((r: ColDef[]) => {
          if (r){
            this.columnDefs = r;
            this.gridApi?.setColumnDefs([]);
            this.gridApi?.setColumnDefs(this.columnDefs);
            this.gridApi?.sizeColumnsToFit();
            this.saveTableState();
          }
          this.service.openChangeHeaderSheet(false);
        });
      }
    });
  }

  getTableData(tableName: string, tableDataPromise: Promise<any>): void {
    const tableStructurePromise = this.rest.getDomainObjectStructure(tableName);
    Promise.all([tableDataPromise, tableStructurePromise]).then((promises) => {
      this.rows = promises[0];
      this.tableStructure = promises[1];
      this.columnDefs = this.setColumnHeaders(promises[1]);
      this.rawTableStructure = Object.assign([{}], this.columnDefs);
      this.changeHeaderSub = this.subForOpenChangeHeader();
      this.init = true;
      this.spinner.hide();
    }).catch((error) => {
      this.message.clearAll();
      if (error.msg && error.title){
        this.message.addError(error.title, error.msg);
      }else {
        if (error.error instanceof Array) {
          const e = error.error[0];
          this.message.addError(`Status - ${error.status}`, `There was an error retrieving ${tableName}\n ${e.errorMsg}`);
        } else {
          this.message.addError('Status', `There was an error retrieving ${tableName}`);
        }
      }
    }).finally(() => {
      this.spinner.hide();
      this.initializing = false;
      this.applyColumnState();
    });

  }

  async goToDetails(event: any): Promise<void> {
    if (this.visiRows.length > 1){
      const result = await this.modals.openConfirmModal('Warning', 'You have multiple rows selected, are you sure you want to go to details page');
      if (!result){
        return;
      }
    }
    this.saveFilterModel();
    this.saveTableState();
    await this.router.navigate(['./details'] , {
      relativeTo: this.route,
      queryParams : {
        id: event.data[this.tableConst.idColName],
        mode: EditMode.EDIT
      }
    });
  }

  async initialize(): Promise<any>{
    if (this.initializing){
      return;
    }
    this.initializing = true;

    const dataSource: DataSourceI = JSON.parse(sessionStorage.getItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE)as string);
    this.spinner.show();
    if (dataSource) {
      const rq: GetTableDataRqI = {
        dataSource: dataSource.name,
        tableName: this.tableConst.name
      };
      const tableData = this.dataSourceRest.getTableData(rq);
      this.getTableData(this.tableConst.name , tableData);
    }

    setTimeout(() => {
      this.spinner.hide();
    }, 60000);
  }

  textCustomComparator(filter: string, value: any, filterText: any): any {
    const filterTextSplitArr: string[] = filterText.toLowerCase().split(',');
    filterTextSplitArr.forEach((element: string, index: number)  => filterTextSplitArr[index] = element.trim());
    const valueLowerCase = value.toString().toLowerCase();

    for (const item of filterTextSplitArr) {
      const regEx: RegExp = new RegExp(item);
      if (regEx.test(valueLowerCase)) {
        return true;
      }
    }
  }

  customValueGetter(params: any): any{
    if (params.data && params.data[params.colDef.field]){
      const data = params.data[params.colDef.field];
      if (data.hasOwnProperty('id')){
        return data.id;
      }else if (data instanceof Array){
        if (data.length === 0){
          return data;
        }
        let dataStr = '';
        data.forEach((item, index) => {
          if (index === data.length - 1){
            dataStr += item.id.toString();
          }else {
            dataStr += item.id.toString() + ', ';
          }
        });
        return dataStr;
      }else {
        return data;
      }
    }else {
      return params.data[params.colDef.field];
    }
  }

  subForCsvEvent(): void{
    this.csvSub = this.service.$exportCsvEvent.subscribe((clicked: boolean) => {
      if (clicked && this.tableConst){
        const params: CsvExportParams = {
          columnSeparator: ',',
          fileName: this.tableConst.name
        };
        this.service.exportDataEvent(false);
        this.gridApi?.exportDataAsCsv(params);
      }
    });
  }

  saveFilterModel(): void{
    const filterModel = this.gridApi?.getFilterModel();
    sessionStorage.setItem(this.tableConst.name + '_filterModel', JSON.stringify(filterModel));
  }

  setFilterModel(): void{
    const filterModelStr = sessionStorage.getItem(this.tableConst.name + '_filterModel');
    if (filterModelStr){
      this.gridApi?.setFilterModel(JSON.parse(filterModelStr));
    }
  }

  refreshFromBulkEdit(): void{
    this.saveFilterModel();
    this.init = false;
    this.initialize();
  }

  updateBulkEditRows(event: any): void{
    this.visiRows = event.api.getSelectedRows();
  }

  saveTableState(): void{
    if (this.gridColumnApi) {
      const state: ColumnState[] = this.gridColumnApi.getColumnState();
      localStorage.setItem(this.colStateName, JSON.stringify(state));
    }else {
      console.error('trying to save the table state before the table is even ready!!');
    }
  }
}
