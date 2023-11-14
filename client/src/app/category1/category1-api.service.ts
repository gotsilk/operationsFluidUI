import { Injectable } from '@angular/core';
import {RootApiService} from '../services/root-api.service';
import {ApiServiceI} from '../interfaces/api-serviceI';
import {
  BulkEditRQ,
  DataSourceI,
  FKSetRS,
  GetTableDataRqI,
  SaveRecordI,
  SaveRecordRSI
} from '../interfaces/commonInterfaces';
import {HttpClient} from '@angular/common/http';
import {DataSourceNames} from '../constants';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Category1ApiService extends RootApiService implements ApiServiceI {

  constructor(public override http: HttpClient, public override router: Router) {
    super(http, router);
  }

  getDynamicTableRecordDetail(rq: any): Promise<any> {
        throw new Error('Method not implemented.');
    }

  getDynamicTableRecords(table:string): Promise<any> {
        throw new Error('Method not implemented.');
    }

  getCurrentDataSource(): string{
    const dataS: DataSourceI = JSON.parse(sessionStorage.getItem(DataSourceNames.DATA_SOURCE_ERROR) as string);
    if (!dataS){
      this.router.navigate(['error']);
    }
    return dataS.name;
  }

  bulkSave(rq: BulkEditRQ): Promise<any> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/errors/bulkSave', rq);
  }

  getFkIdsDisplayName(rq: GetTableDataRqI): Promise<FKSetRS[]> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/errors/getFkList', rq);
  }

  getTableData(rq: GetTableDataRqI): Promise<any> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/errors/getDomainRecords', rq);
  }

  saveDomainRecord(rq: SaveRecordI): Promise<SaveRecordRSI> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/errors/saveDomainRecord', rq);
  }

  getTablesOnDataSource(): Promise<any> {
    return Promise.resolve(undefined);
  }



}
