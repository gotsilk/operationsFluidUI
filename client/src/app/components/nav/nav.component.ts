import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {DataSourceI, DataSourcePartsI} from '../../interfaces/commonInterfaces';
import {Subscription} from 'rxjs';
import {ModalService} from '../../modals/modal.service';
import {Router} from '@angular/router';
import {DataSourceService} from '../../services/data-source.service';
import {ApiService} from '../../services/api.service';
import {SuPropertiesService} from '../../services/su-properties.service';
import {RoutingChangeService} from '../../services/routing-change.service';
import {CommonService} from '../../services/common.service';
import {DataSourceNames, DataSourceTypes, SessionStorageKeys, suDbRoutes} from 'src/app/constants';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
@AutoUnsubscribe()
export class NavComponent implements OnInit {

  @Output() initComplete = new EventEmitter<boolean>();

  lastRecordedDataSource: DataSourceI | null | undefined;
  activeLink: string | undefined;
  init: boolean;
  name: string;
  dataSourceName: any;
  dataSource!: DataSourceI;
  dataSourceParts: DataSourcePartsI;
  showCreateMenu: boolean|null;
  showChangeHeaders: boolean|null;
  waiting: boolean;
  currentDbState: string | undefined | null;
  changeDbModalSub!: Subscription;
  regEx!: RegExp;

  constructor(private modalService: ModalService, private service: CommonService,
              public router: Router, public dataService: DataSourceService,
              private routingService: RoutingChangeService, public commonApi: ApiService, public propertyService: SuPropertiesService) {

    this.dataSourceParts = {environment: '', region: '', type: ''};
    const seshDataSource = sessionStorage.getItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE);
    if (seshDataSource) {
      const lastRecordedDataSource = JSON.parse(seshDataSource);
      if (lastRecordedDataSource) {
        this.dataSource = lastRecordedDataSource;
      }
    }
    this.init = false;
    this.showCreateMenu = true;
    this.showChangeHeaders = false;
    this.waiting = true;
    this.activeLink = '';
    this.subForRootStateChange();
    this.name = '';
    this.regEx = new RegExp(this.propertyService.getProperty('datasource.regex.matcher'), 'gi');
  }

  get DataSourceTypes(): typeof DataSourceTypes {
    return DataSourceTypes;
  }

  async ngOnInit(): Promise<void> {
    this.getUserName();
    if (!this.dataSource) {
      await this.openChangedDataSource();
      this.navigateToCorrectDbState(this.dataSource);
    }

    this.subForDataSourceChange();
    this.subForShowCreateMenu();
    this.subForShowChangeHeaderBtn();
    this.matchDataSourceParts();
    this.init = true;
    this.initComplete.emit(true);
  }

  async getUserName(): Promise<any>{
    const res: any = await this.commonApi.getUserCurrentUserDetails();
    this.name = res.userName;
  }

  async openChangedDataSource(): Promise<any> {
      await this.modalService.openChangeDataSource();
      this.dataSource = JSON.parse(sessionStorage.getItem(SessionStorageKeys.LAST_RECORDED_DATA_SOURCE) as string);
      this.matchDataSourceParts();
  }

  subForShowCreateMenu(): void{
    this.service.$showCreateNewMenu.subscribe((show => {
      if (show !== undefined) {
        this.showCreateMenu = show;
      }
    }));
  }

  showCreateMenuFn(show: boolean): void{
    this.service.showCreateMenu(show);
  }

  subForShowChangeHeaderBtn(): void{
    this.service.$showChangeHeaders.subscribe((res => {
      if (res != null || res !== undefined) {
        this.showChangeHeaders = res;
      }
    }));
  }

  subForDataSourceChange(): void{
    this.dataService.$dataSource.subscribe((res: DataSourceI|null) => {
      if (res) {
        if (res.type !== this.dataSource.type) {
          this.navigateToCorrectDbState(res);
        }
        this.dataSource = res;
        this.matchDataSourceParts();
      }
    });
  }

  navigateToCorrectDbState(dataSource: DataSourceI ): void{
      switch (dataSource.type) {
        case DataSourceNames.DATA_SOURCE_FARE :
          this.router.navigate([suDbRoutes.FARE]);
          this.activeLink = 'fare';
          break;
        case DataSourceNames.DATA_SOURCE_MEMBER :
          this.router.navigate([suDbRoutes.MEMBER]);
          this.activeLink = 'member';
          break;
        case DataSourceNames.DATA_SOURCE_ERROR :
          this.router.navigate([suDbRoutes.ERROR]);
          this.activeLink = 'error';
          break;
      }
  }

  async switchDataSource(dataSourceType: string): Promise<any>{
    let status;
    let dst: DataSourceTypes|null = null;
    switch (dataSourceType){
      case 'fare':
        status = this.dataService.switchToFareDataSource();
        dst = DataSourceTypes.FARE;
        break;
      case 'member':
        status = this.dataService.switchToMemberDataSource();
        dst = DataSourceTypes.MEMBER;
        break;
      case 'error':
        status = this.dataService.switchToErrorDataSource();
        dst = DataSourceTypes.Error;
        break;
    }
    if (!status) {
      if (dst) {
        await this.modalService.openChangeDataSource(dst);
      }
    }
    this.service.showChangeHeader(false);
  }

  subForRootStateChange(): void{
    this.routingService.$parentRouteChange.subscribe((rootState) => {
      if (rootState){
        this.switchDataSource(rootState);
        this.activeLink = rootState;
      }else {
        this.activeLink = '';
      }
    });
  }

  openChangeHeadersBtnSheet(status: boolean): void{
    this.service.openChangeHeaderSheet(status);
  }

  logout(): any{
    this.commonApi.logout().finally(() => {
      window.location.reload();
    });
  }

  matchDataSourceParts(): void{
    let m;
    this.dataSourceParts.type = 'no match';
    this.dataSourceParts.region = 'no match';
    this.dataSourceParts.environment = 'no match';

    // tslint:disable-next-line:no-conditional-assignment
    while ((m = this.regEx.exec(this.dataSource.name)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === this.regEx.lastIndex) {
        this.regEx.lastIndex++;
      }
      this.dataSourceParts.type = m[1];
      this.dataSourceParts.region = m[2];

      this.dataSourceParts.environment = m[3] ? '-' + m[3] : '';
    }
  }
}
