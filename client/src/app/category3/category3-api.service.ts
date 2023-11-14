import { Injectable } from '@angular/core';
import {RootApiService} from '../services/root-api.service';
import {HttpClient} from '@angular/common/http';
import {
  BulkEditRQ,
  DataSourceI,
  FKSetRS,
  GetTableDataRqI,
  SaveRecordI,
  SaveRecordRSI
} from '../interfaces/commonInterfaces';
import {DataSourceNames} from '../constants';
import {ApiServiceI} from '../interfaces/api-serviceI';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Category3ApiService extends RootApiService implements ApiServiceI{

  constructor(public override http: HttpClient, public override router: Router) {
    super(http, router);
  }

  bulkSave(rq: BulkEditRQ): Promise<any> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/member/bulkSave', rq);
  }

  getTableData(rq: GetTableDataRqI): Promise<any> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/member/getDomainRecords', rq);
  }

  getCurrentDataSource(): string{
    const dataS: DataSourceI = JSON.parse(sessionStorage.getItem(DataSourceNames.DATA_SOURCE_MEMBER) as string);
    if (!dataS){
      this.router.navigate(['member']);
    }
    return dataS.name;
  }

  saveDomainRecord(rq: SaveRecordI): Promise<SaveRecordRSI> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/member/saveDomainRecord', rq);
  }

  getFkIdsDisplayName(rq: GetTableDataRqI ): Promise<FKSetRS[]> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/member/getFkList', rq);
  }

  saveDynamicContentRecord(rq: any ): Promise<SaveRecordRSI> {
    rq.dataSource = this.getCurrentDataSource();
    return this.post('api/member/saveDynamicContent', rq);
  }

  getTablesOnDataSource(): Promise<any> {
    return Promise.resolve(undefined);
  }

  getDynamicTableRecords(table: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getDynamicTableRecordDetail(rq: any): Promise<any> {
    return Promise.resolve(undefined);
  }
}
