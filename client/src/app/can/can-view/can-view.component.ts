import { Component, OnInit } from '@angular/core';
import {SuPropertiesService} from '../../services/su-properties.service';
import {HttpClient} from '@angular/common/http';
import {SuMessageService} from '../../services/su-message.service';
import {ServerListI} from '../../interfaces/commonInterfaces';

@Component({
  selector: 'app-can-view',
  templateUrl: './can-view.component.html',
  styleUrls: ['./can-view.component.scss']
})
export class CanViewComponent implements OnInit {


  geoLocationCacheFlushUri: string;
  flushing: boolean;
  serverList: ServerListI[];

  constructor(private suPropertyService: SuPropertiesService, private http: HttpClient, private suMsg: SuMessageService) {
    let servers = this.suPropertyService.getProperty('can.server.list');
    servers = servers.split(',');
    this.serverList = [];
    servers.forEach((server: string) => {
      this.serverList.push({flushing: false, url: `https://${server}:8443`});
    });
    this.geoLocationCacheFlushUri = '/app/testing/flushcache?cacheLabel=geolocation';
    this.flushing = false;
  }

  async flushCache(index?: number): Promise<any>{
      if (index != undefined){
        this.serverList[index].flushing = true;
        const url = this.serverList[index].url + this.geoLocationCacheFlushUri;
        const serverRes: any = await this.http.get(url).toPromise();
        if (serverRes && serverRes.msg) {
          this.suMsg.addInfo('Cache Flushed', `Server: ${this.serverList[index].url}, GeoLocation cached flushed`);
          this.serverList[index].flushing = false;
        }
      }else {
        this.serverList.forEach(async (server: ServerListI) => {
          server.flushing = true;
          const url = server.url + this.geoLocationCacheFlushUri;
          const serverRes: any = await this.http.get(url).toPromise();
          if (serverRes && serverRes.msg) {
            this.suMsg.addInfo('Cache Flushed', `Server: ${server.url}, GeoLocation cached flushed`);
          }
          server.flushing = false;
        });
      }
      return;
  }

  ngOnInit(): void {
  }

}
