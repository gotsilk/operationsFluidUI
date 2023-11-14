import {Injectable} from '@angular/core';
import {RootApiService} from './root-api.service';
import {HttpClient} from '@angular/common/http';
import {urls} from '../constants';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SuPropertiesService extends RootApiService{

  static propMap: any;

  constructor(public override http: HttpClient, public override router: Router) {
    super(http, router);
  }

  async getProperties(): Promise<any> {
    SuPropertiesService.propMap = await this.get(urls.GET_CLIENT_SIDE_PROPS);
  }

  getProperty(name: string): any {
    if (SuPropertiesService.propMap.hasOwnProperty(name)){
      return SuPropertiesService.propMap[name];
    }
    return null;
  }
}
