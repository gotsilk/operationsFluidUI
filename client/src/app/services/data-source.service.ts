import { Injectable } from '@angular/core';
import {DataSourceI} from '../interfaces/commonInterfaces';
import {BehaviorSubject} from 'rxjs';
import {DataSourceNames, SessionStorageKeys} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {

  constructor() { }

  static currentDbType: string;
  static currentMemberDataSource: DataSourceI;
  static currentFareDataSource: DataSourceI;
  static currentErrorDataSource: DataSourceI;
  static currenStatsDataSource: DataSourceI;
  static currentDataSource: DataSourceI;

  private dataSourceData = new BehaviorSubject<DataSourceI|null>(null);
  $dataSource = this.dataSourceData.asObservable();

  private lastDataSourceData = new BehaviorSubject<DataSourceI|null>(null);
  $lastDataSourceData = this.lastDataSourceData.asObservable();

  dataSourceChanged(dataSource: DataSourceI): void{
    if (dataSource === DataSourceService.currentDataSource){
      return;
    }
    DataSourceService.currentDataSource = dataSource;
    console.log(`Setting individual data source, type: ${dataSource.type}, name ${dataSource.name}`);
    sessionStorage.setItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE, JSON.stringify(dataSource));
    this.setIndividualDataSources(dataSource);
    this.lastDataSourceData.next(DataSourceService.currentDataSource);
    this.dataSourceData.next(dataSource);
  }

  getLastRecordedDataSource(): DataSourceI | null{
    if (DataSourceService.currentDataSource){
      return DataSourceService.currentDataSource;
    }else {
      if (JSON.parse(sessionStorage.getItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE) as string)){
        return JSON.parse(sessionStorage.getItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE) as string);
      }
    }
    return null;
  }

  setIndividualDataSources(dataSource: DataSourceI): void{
    switch (dataSource.type){
      case DataSourceNames.DATA_SOURCE_FARE:
        DataSourceService.currentFareDataSource = dataSource;
        break;
      case DataSourceNames.DATA_SOURCE_MEMBER:
        DataSourceService.currentMemberDataSource = dataSource;
        break;
      case DataSourceNames.DATA_SOURCE_STATS:
        DataSourceService.currenStatsDataSource = dataSource;
        break;
      case DataSourceNames.DATA_SOURCE_ERROR:
        DataSourceService.currentErrorDataSource = dataSource;
        break;
    }
    sessionStorage.setItem(dataSource.type as string, JSON.stringify(dataSource));
  }

  switchToFareDataSource(): boolean{
    console.log('switching to in memory fare');
    if (DataSourceService.currentFareDataSource) {
      this.dataSourceChanged(DataSourceService.currentFareDataSource);
      return true;
    }else {
      const sessionFareDb = JSON.parse(sessionStorage.getItem(DataSourceNames.DATA_SOURCE_FARE) as string);
      if (sessionFareDb){
        this.dataSourceChanged(sessionFareDb);
        return true;
      }
      return false;
    }
  }

  switchToMemberDataSource(): boolean{
    console.log('switching to in memory member');
    if (DataSourceService.currentMemberDataSource) {
      this.dataSourceChanged(DataSourceService.currentMemberDataSource);
      return true;
    }else {
      const sessionMember = JSON.parse(sessionStorage.getItem(DataSourceNames.DATA_SOURCE_MEMBER) as string);
      if (sessionMember){
        this.dataSourceChanged(sessionMember);
        return true;
      }
      return false;
    }
  }

  switchToErrorDataSource(): boolean{
    console.log('switching to in memory member');
    if (DataSourceService.currentErrorDataSource) {
      this.dataSourceChanged(DataSourceService.currentErrorDataSource);
      return true;
    }else {
      const sessionError = JSON.parse(sessionStorage.getItem(DataSourceNames.DATA_SOURCE_ERROR) as string);
      if (sessionError){
        this.dataSourceChanged(sessionError);
        return true;
      }
      return false;
    }
  }
}
