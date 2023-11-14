import {ModalService} from '../modals/modal.service';
import {FormGroup} from '@angular/forms';
import {
  ColumnStructureI,
  DomainStructureI,
  GetStoredTableData,
  GetTableDataRqI,
  SaveRecordI,
  SaveRecordRSI,
  SaveRowErrorI,
  SaveTableDataRQI,
  ServerSideErrorRSI,
  TableDetailConstI, TableI,
} from '../interfaces/commonInterfaces';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ApiServiceI} from '../interfaces/api-serviceI';
import {SuMessageService} from '../services/su-message.service';
import {Utilities} from './Utilities';
import {SuPropertiesService} from '../services/su-properties.service';
import {EditMode} from '../constants';
import {Subscription} from 'rxjs';
import {Debugging} from '../Debugging';
import {DataSourceService} from '../services/data-source.service';
import {ApiService} from '../services/api.service';
import {deepCloneNode} from '@angular/cdk/drag-drop/clone-node';


export abstract class TableRowDetailBase {

  debug = Debugging.debugEnabled;
  blackList!: string[];
  ogData!: any;
  form: FormGroup;
  // set this ONCE on form load
  formInitValueState: any;
  tableName!: string;
  idName!: string;
  dataStructureModel!: DomainStructureI;
  formEditEnabled: boolean;
  chunkedList!: ColumnStructureI[][];
  rowData!: any;
  detailsInit: boolean;
  skipId!: boolean;
  dataSourceName!: string;
  tableKey!: string;
  rest!: ApiServiceI;
  isProd!: boolean;
  mode: EditMode | undefined;
  savingFlag: boolean;
  paramSub!: Subscription;
  firstLoad!: boolean;

  protected constructor(public suMessage: SuMessageService, public modals: ModalService, public datePipe: DatePipe,
                        public commonRest: ApiService, public route: ActivatedRoute, public suProperties: SuPropertiesService,
                        public router: Router, public datasourceService: DataSourceService) {
    this.formEditEnabled = false;
    this.detailsInit = false;
    this.ogData = null;
    this.form = new FormGroup({});
    this.form.disable();
    this.savingFlag = false;
    this.subForDataSourceChange();
  }

  toggleEdit(form: FormGroup): void {
    this.formEditEnabled = !this.formEditEnabled;
    this.formEditEnabled ? form.enable() : form.disable();
  }

  async transferRowData(): Promise<any> {
    this.savingFlag = true;
    const transObj = await this.getTransferObj();
    this.commonRest.transferDataToProd(transObj).then((res) => {
      if (res.status) {
        this.suMessage.addWarn('Status', `Transfer Success!, You will need to go to server, import, then save`);
      } else {
        this.suMessage.addError('Status', 'TRANSFER FAIL!');
      }
    }).catch((error) => {
      console.error(error);
      this.suMessage.addError('Import Status', 'TRANSFER FAIL!');
    }).finally(() => {
      this.savingFlag = false;
    });
  }

  async getTransferObj(): Promise<SaveTableDataRQI> {
    const recordData = Object.assign({}, this.rowData);
    recordData[this.idName] = null;
    const data = {
      tableKey: this.tableKey,
      data: JSON.stringify(recordData)
    };
    return Promise.resolve(data);
  }

  async transferRowDataLocally(): Promise<any> {
    const transObj = await this.getTransferObj();
    this.commonRest.transferDataLocally(transObj).then((res) => {
      if (res.status) {
        this.suMessage.addWarn('Status', `Transfer Success!, You will need to, import, then save`);
      } else {
        this.suMessage.addError('Status', 'TRANSFER FAIL!');
      }
    }).catch((error) => {
      console.error(error);
      this.suMessage.addError('Import Status', 'TRANSFER FAIL!');
    });
  }

  importData(): void {
    this.getStoredTableSpecificObject(this.tableKey).then((importedData) => {
      if (importedData) {
        this.rowData = importedData;
        Utilities.setFormValues(this.form, this.rowData, this.dataStructureModel, ['dateCreated', 'lastUpdated', 'id']);
      }
    });
  }

  async getStoredTableSpecificObject(key: any): Promise<any> {
    const rq: GetStoredTableData = {
      tableKey: key
    };
    const res = await this.commonRest.getStoredTableData(rq);
    if (res.success){
      if (res.result){
        return Promise.resolve(JSON.parse(res.result));
      }else {
        this.suMessage.addWarn('Status', `Looks like no imported data was stored on this exact server`);
        return Promise.resolve(null);
      }
    }else {
      this.suMessage.addError('Status', `Cannot get stored table data`);
      return Promise.reject(null);
    }
  }

  async getDataStructureModel(tableName: string): Promise<DomainStructureI> {
    return await this.commonRest.getDomainObjectStructure(tableName);
  }

  formatData(structurePromise: DomainStructureI, rowDataPromise: any, blackList?: string[], chunkSize: number = 10): void {
    structurePromise.cols.forEach((col: ColumnStructureI) => {
      if (col.constraints.inlist) {
        col.constraints.inlist = Utilities.makeList(col.constraints.inlist);
      }
    });
    this.chunkedList = Utilities.chunk(structurePromise.cols, chunkSize);
    if (rowDataPromise) {
      this.rowData = rowDataPromise[0];
      if (this.rowData.hasOwnProperty('version')) {
        delete this.rowData.version;
      }
      this.ogData = this.mode === EditMode.COPY ? null : Object.assign({}, this.rowData);
      this.form = Utilities.setFormValues(this.form, this.rowData, this.dataStructureModel, blackList);
      this.setFormsInitValue();
    }
    this.chunkedList = Utilities.determineIfTextAreaShown(this.chunkedList, this.rowData);
  }

  async initialize(): Promise<any> {
    this.rowData = await this.getRecordData().catch(() => {
      this.suMessage.addError('Status', 'Error loading the row');
      return Promise.reject();
    });

    if (this.rowData instanceof Array && this.rowData.length === 0) {
      this.suMessage.addError('Status', 'Error loading the row');
      return Promise.reject();
    }

    this.dataStructureModel = await this.getDataStructureModel(this.tableName).catch(() => {
      this.suMessage.addError('Status', 'Error loading the row');
      return Promise.reject();
    });
    this.isProd = this.suProperties.getProperty('prodLevelServer.type');
    this.form = Utilities.buildForm(this.dataStructureModel, this.blackList);
    this.formatData(this.dataStructureModel, this.rowData, this.blackList);

    this.formEditEnabled = this.mode !== EditMode.EDIT;

    if (this.mode === EditMode.COPY) {
      if (this.form.controls[this.idName]) {
        this.form.controls[this.idName].setValue(null);
      }
      this.rowData[this.idName] = null;
    }

    if (this.mode === EditMode.NEW || this.mode === EditMode.COPY) {
      this.form.enable();
    } else {
      this.form.disable();
    }

    this.detailsInit = true;
  }

  setFormsInitValue(): void {
    this.formInitValueState = this.deepCopy(this.form.value);
  }

  deepCopy(obj: any): any {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          // @ts-ignore
          copy[attr] = this.deepCopy(obj[attr]);
        }
      }
      return copy;
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
  }

  async viewStoredObj(): Promise < any > {
    this.getStoredTableSpecificObject(this.tableKey).then((res) => {
      if (res) {
        this.modals.openJsonView(res);
      }
    });
  }

  async confirmDiscardChanges(): Promise<void>{
    // touched but not changed
    if (!this.form.dirty) {
      this.toggleEdit(this.form);
      this.form.reset(this.formInitValueState);
      return;
    }
    const msg = 'Cancel and discard changes?';
    const confirmed = await this.modals.openConfirmModal('Confirm', msg);
    if (confirmed){
      this.toggleEdit(this.form);
      this.form.reset(this.formInitValueState);
    }
  }

  async getRecordData(): Promise<any>{
    const code = this.route.snapshot.queryParams['id'];
    if (code && code !== 'new') {
      const rq: GetTableDataRqI = {
        ident: code.toString(),
        tableName: this.tableName
      };
      return await this.rest.getTableData(rq);
    }
    return Promise.resolve();
  }

  async persistRow(): Promise<SaveRecordRSI> {
    const rq: SaveRecordI = {};
    if (this.rowData && this.rowData[this.idName]){
      rq.id = this.rowData[this.idName];
    }
    rq.tableName = this.tableName;
    rq.skipId = this.skipId;
    rq.formValue = this.form.value;
    return await this.rest.saveDomainRecord(rq);
  }

  async save(): Promise<any> {
    this.savingFlag = true;
    let toSave = true;
    let compareDialogPromise: Promise<any>|undefined;
    if (this.mode === EditMode.EDIT){
      compareDialogPromise = this.modals.openCompareModal(this.form.value, this.ogData, this.dataStructureModel);
    }
    await compareDialogPromise?.catch(() => {
      toSave = false;
    });

    if (toSave){
      try {
        const result = await this.persistRow();
        if (result.success) {
          this.navigateToNewRecord(result.id);
        } else {
          if (result.backendMsg) {
            const msg = result.backendMsg + '\n';
            this.suMessage.addError(`Error saving ${this.tableName}`, msg);
          }
          result?.backEndErrors.forEach((errorObj: ServerSideErrorRSI) => {
            const ba = `col: ${errorObj.colName}, rejected value: ${errorObj.attemptedColVal}\n
          msg: ${errorObj.errorMsg}`;
            this.suMessage.addError(`Error saving ${this.tableName}`, ba);
          });

          result?.errors?.forEach((errorObj: SaveRowErrorI) => {
            const ba = `col: ${errorObj.columnName}, rejected value: ${errorObj.rejectedValue}\n`;
            this.suMessage.addError(`Error saving ${this.tableName}`, ba);
          });
        }
      }catch (e){
        console.log(e);
      }
    }

    this.savingFlag = false;
  }

  setTableInitDetailsValues(table: any): void{
    this.idName = table.idColName;
    this.blackList = table.enableIdChange ? [] : [this.idName];
    this.skipId = !(!!table.enableIdChange);
    if (table.fkList && table.fkList.length > 0) {
      this.blackList.push.apply(this.blackList, table.fkList);
    }
    this.tableKey = `suOper${table.name}ObjectStore`;
    this.tableName = table.name;
  }

  async navigateToNewRecord(id: any): Promise<void>{
    this.suMessage.addSuccess('Saved', `Saved to table with ID: ${id}`);
    if (this.mode !== EditMode.EDIT){
      await this.router.navigate([],
        {
          queryParams: {
            mode: EditMode.EDIT,
            id
          },
          relativeTo: this.route
        });
    }else{
      this.initialize();
    }
  }

  async copy(event: any): Promise<any> {
    if (event) {
      this.suMessage.addInfo('Copy', `Copied over: ${this.rowData[this.idName]}`);
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          id: this.rowData[this.idName],
          mode: EditMode.COPY
        }
      });
    }
  }

  subForParams(): void{
    this.paramSub = this.route.queryParams.subscribe((event: Params) => {
      if (this.firstLoad){
        this.firstLoad = false;
        return;
      }
      if (event instanceof ProgressEvent){
        return;
      }


      if (event){
        if (event['mode']){
          this.mode = event['mode'];
        }
        this.initialize();
      }
    });
  }

  subForDataSourceChange(): void{
    this.datasourceService.$dataSource.subscribe((res) => {
      if (this.detailsInit && res) {
        this.detailsInit = false;
        this.initialize();
      }
    });
  }
}


