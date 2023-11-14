import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataSourceNames} from '../constants';
import {RootApiService} from '../services/root-api.service';
import {
  BulkEditRQ,
  DataSourceI,
  FKSetRS,
  GetTableDataRqI,
  SaveRecordI,
  SaveRecordRSI
} from '../interfaces/commonInterfaces';
import {ApiServiceI} from '../interfaces/api-serviceI';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Category2ApiService extends RootApiService implements ApiServiceI{

  constructor(public override http: HttpClient, public override router: Router) {
    super(http, router);
  }

  getDynamicTableRecordDetail(rq: any): Promise<any> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/fare/getDynamicTableDetail', rq);
  }

  getCurrentDataSource(): string{
    const dataS: DataSourceI = JSON.parse(sessionStorage.getItem(DataSourceNames.DATA_SOURCE_FARE) as string);
    if (!dataS){
      this.router.navigate(['fare']);
    }
    return dataS.name;
  }

  getTableData(rq: GetTableDataRqI): Promise<any> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/fare/getDomainRecords', rq);
  }

  saveDomainRecord(rq: SaveRecordI): Promise<SaveRecordRSI> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/fare/saveDomainRecord', rq);
  }

  getFkIdsDisplayName(rq: GetTableDataRqI): Promise<FKSetRS[]> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/fare/getFkList', rq);
  }

  bulkSave(rq: BulkEditRQ): Promise<any> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/fare/bulkSave', rq);
  }

  getTablesOnDataSource(): Promise<any> {
    return this.post('api/fare/getTables', {dataSource: this.getCurrentDataSource()});
  }

  getDynamicTableRecords(tableName: string): Promise<any> {
    const rq = {
      dataSource: this.getCurrentDataSource(),
      tableName
    };
    return this.post('api/fare/getDynamicTableList', rq);
  }
}
