import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RootApiService} from '../services/root-api.service';
import {GetStoredTableData, SaveTableDataRQI} from '../interfaces/commonInterfaces';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiService extends RootApiService{

  constructor(public override http: HttpClient, public override router: Router) {
    super(http, router);
  }


  getAllDataSources(): Promise<any>{
    return this.get('api/common/getAllDataSources');
  }

  getDomainObjectStructure(domainName: string): Promise<any>{
    return this.post('api/common/getDomainObjectStructure', {domainName});
  }

  getUserCurrentUserDetails(): Promise<any>{
    return this.get('api/common/getUserCurrentUserDetails');
  }

  getAuth(rq: any): Promise<any>{
    return this.post('api/common/getCurrentAuths', rq);
  }

  logout(): Promise<any>{
    return this.post('logout', {});
  }

  transferDataToProd(rq: SaveTableDataRQI): Promise<any> {
    return this.post('api/common/transferTableData', rq);
  }

  transferDataLocally(rq: SaveTableDataRQI): Promise<any> {
    return this.post('api/common/transferTableDataLocally', rq);
  }

  getStoredTableData(rq: GetStoredTableData): Promise<any>{
    return this.post('api/common/getTableData', rq);
  }

  executeSql(rq: any): Promise<any>{
    return this.post('api/superuser/executeSql', rq);
  }


  isUserPermitted(tableType: string): Promise<any> {
    return this.post('api/common/checkAuthentication', {tableType});
  }

  getMatchSchoolList(searchText: string, dataSource: string): Promise<any>{
    return this.post('schoolImporterApi/fuzzyMatchUniversityName', {searchText, dataSource});
  }

  getUnivLocationList(dataSource: string): Promise<any>{
    return this.post('schoolImporterApi/getUnivLocation', {dataSource});
  }

  saveUniversity(rq: any, dataSource: string): Promise<any>{
    rq['dataSource'] = dataSource;
    return this.post('schoolImporterApi/saveUniversity', rq);
  }
}
