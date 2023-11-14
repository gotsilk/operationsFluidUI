import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {CommonService} from '../../services/common.service';
import {Utilities} from '../Utilities';
import {SuMessageService} from '../../services/su-message.service';
import {DataSourceService} from '../../services/data-source.service';
import {DataSourceI} from '../../interfaces/commonInterfaces';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {ApiService} from '../../services/api.service';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[suAuth]'
})
@AutoUnsubscribe()
export class SuAuthDirective implements OnInit{

  static EDIT = 'edit';
  static VIEW = 'view';
  static SUPER = 'super';

  @Input() mode!: 'edit'|'view'|undefined|'super';
  @Input() reverse!: boolean;
  authorized: boolean;
  dbType: any;
  lastDataSub!: Subscription;

  constructor(private rest: ApiService, public el: ElementRef,
              private messages: SuMessageService, private service: CommonService, private dataService: DataSourceService) {
    this.authorized = false;
  }



  ngOnInit(): void {
    this.initialize();
  }

 async initialize(): Promise<any>{
    this.dbType = await this.getDataSource();
    const rq = {
    mode : this.mode,
    database: this.dbType
  };
    this.rest.getAuth(rq).then((res => {
      this.authorized = res;
      this.el.nativeElement.hidden = !this.authorized;
      if (this.mode === SuAuthDirective.EDIT){
        this.service.updateEditData(this.authorized);
      }else {
        this.service.updateViewData(this.authorized);
      }
      if (!this.authorized){
        this.messages.addWarn('WARNING', 'NOT AUTHORIZED to: ' + this.mode);
      }
    }));
 }

  async getDataSource(): Promise<any>{
    return new Promise((resolve, reject) => {
      const lastDataSource: DataSourceI|null = this.dataService.getLastRecordedDataSource();
      if (lastDataSource){
        resolve(Utilities.getDbType(lastDataSource.name));
      }else {
        this.lastDataSub = this.dataService.$lastDataSourceData.subscribe((data) => {
          if (data){
            resolve(Utilities.getDbType(data.name));
          }
        });
      }
    });
  }
}
