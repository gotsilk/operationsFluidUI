import {Component, Injector, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AutoUnsubscribe} from '../../AutoUnsubscribe';
import {TableRowDetailBase} from '../../utils/TableRowDetailBase';
import {TableDetailsI} from '../../interfaces/tableDetailsI';
import {ApiServiceI} from '../../interfaces/api-serviceI';
import {TableI} from '../../interfaces/commonInterfaces';
import {DataSourceNames, EditMode} from '../../constants';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SuMessageService} from '../../services/su-message.service';
import {ApiService} from '../../services/api.service';
import {DatePipe} from '@angular/common';
import {ModalService} from '../../modals/modal.service';
import {SuPropertiesService} from '../../services/su-properties.service';
import {DataSourceService} from '../../services/data-source.service';
import {Category3ApiService} from '../../category3/category3-api.service';
import {CATEGORY3, CATEGORY1, CATEGORY2} from '../../TableDetails';
import {Category2ApiService} from '../../category2/category2-api.service';
import {Category1ApiService} from '../../category1/category1-api.service';
import {FormGroup} from '@angular/forms';
import {FkPointerComponent} from '../fk-pointer/fk-pointer.component';


@Component({
  selector: 'app-universal-details',
  templateUrl: '../../commonTemplates/standardDetailsTemplate.html',
  styleUrls: ['./universal-details.component.scss']
})
@AutoUnsubscribe()
export class UniversalDetailsComponent extends TableRowDetailBase implements OnInit, TableDetailsI  {

  @ViewChild('fkSpot', {read: ViewContainerRef, static: true})
  componentPlaceHolder!: ViewContainerRef;

  override blackList!: string[];
  override tableName!: string;
  override idName!: string;
  override dataStructureModel: any;
  override skipId!: boolean;
  override dataSourceName!: string;
  override tableKey!: string;
  enableIdChange: boolean;
  override rest: ApiServiceI;
  override isProd: boolean;
  tableConst!: any;
  dbType: string;
  override mode: EditMode;
  override paramSub!: Subscription;
  override firstLoad: boolean;

  constructor(public override route: ActivatedRoute,  public message: SuMessageService,
              public override commonRest: ApiService, public override datePipe: DatePipe, public override router: Router,
              public injector: Injector, public override modals: ModalService, public override suProperties: SuPropertiesService,
              public override datasourceService: DataSourceService) {
    super(message, modals, datePipe, commonRest, route, suProperties, router, datasourceService);

    this.firstLoad = true;
    const urlSplit: string[] = this.router.url.split('/'); // member/error/fare/etc first element is "" for some reason
    const tableName: string = urlSplit[2];
    const key = 'mode';
    this.mode = this.route.snapshot.queryParams[key] as EditMode;
    this.dbType = urlSplit[1];
    switch (this.dbType){
      case 'member':
        this.rest = this.injector.get(Category3ApiService);
        this.tableConst = CATEGORY2.find((it: TableI) => it.name.toLowerCase() === tableName.toLowerCase());
        this.dataSourceName = DataSourceNames.DATA_SOURCE_MEMBER;
        break;
      case 'fare' :
        this.rest = this.injector.get(Category2ApiService);
        this.tableConst = CATEGORY1.find((it: TableI) => it.name.toLowerCase() === tableName.toLowerCase());
        this.dataSourceName = DataSourceNames.DATA_SOURCE_FARE;
        break;
      case 'error' :
        this.rest = this.injector.get(Category1ApiService);
        this.tableConst = CATEGORY3.find((it: TableI) => it.name.toLowerCase() === tableName.toLowerCase());
        this.dataSourceName = DataSourceNames.DATA_SOURCE_ERROR;
        break;
      default:
        this.rest = this.injector.get(Category2ApiService);
    }
    this.skipId = true;
    this.setTableInitDetailsValues(this.tableConst);
    this.enableIdChange = false;
    this.formEditEnabled = false;
    this.detailsInit = false;
    this.ogData = null;
    this.form = new FormGroup({});
    this.form.disable();
    this.isProd = true;
    this.subForParams();
  }

  async ngOnInit(): Promise<any> {
    await this.initialize().catch((e) => {
      this.router.navigate(['../'], {relativeTo: this.route});
    });

    if (this.tableConst.fkList && this.tableConst.fkList.length > 0){
      this.componentPlaceHolder.clear();
      this.tableConst.fkList.forEach((setItem: string) => {
        this.loadComponent(setItem);
      });
    }
  }

  loadComponent(propName: string): any {
    if (this.rowData) {
      const ids: any[] = [];
      this.rowData[propName].forEach((item: any) => {
        ids.push(item.id);
      });
      const component = this.componentPlaceHolder.createComponent(FkPointerComponent);
      component.instance.tableName = propName;
      component.instance.rowIds = ids;
    }
  }
}
