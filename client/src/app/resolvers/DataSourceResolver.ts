import { Injectable } from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router, Resolve} from '@angular/router';
import {ModalService} from '../modals/modal.service';
import {DataSourceNames, DataSourceTypes, SessionStorageKeys} from '../constants';
import {DataSourceI} from '../interfaces/commonInterfaces';

@Injectable({
  providedIn: 'root'
})
export class DataSourceResolver implements Resolve<DataSourceI | null>  {


  constructor(private modalService: ModalService, private router: Router) {  }

  async resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<DataSourceI | null> {

    const path = route.routeConfig?.path;
    if (path){
      const name: DataSourceNames = this.getDataSourceName(path);

      let stringData: string |null = sessionStorage.getItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE);
      if (stringData) {
        const d = JSON.parse(stringData) as DataSourceI;
        if (d.name === name){
          return d;
        }
      }


      const datasource = sessionStorage.getItem(name);
      if (!datasource){
         const type: DataSourceTypes = this.getDataSourceType(path);
         await this.modalService.openChangeDataSource(type);
         stringData = sessionStorage.getItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE);
         if (stringData) {
            return JSON.parse(stringData) as DataSourceI;
         }

      }else{
        return JSON.parse(datasource) as DataSourceI;
      }
    }
    return null;
  }


  getDataSourceName(path: string): DataSourceNames {
    switch (path){
      case 'member' :
        return DataSourceNames.DATA_SOURCE_MEMBER;
      case 'fare':
        return DataSourceNames.DATA_SOURCE_FARE;
      case 'error':
        return DataSourceNames.DATA_SOURCE_ERROR;
      default:
        return DataSourceNames.DATA_SOURCE_FARE;
    }
  }

  getDataSourceType(path: string): DataSourceTypes {
    switch (path){
      case 'member' :
        return DataSourceTypes.MEMBER;
      case 'fare':
        return DataSourceTypes.FARE;
      case 'error':
        return DataSourceTypes.Error;
      default:
        return DataSourceTypes.FARE;
    }
  }
}
