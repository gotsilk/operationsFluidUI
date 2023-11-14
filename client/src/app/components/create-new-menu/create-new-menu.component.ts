import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import { AutoUnsubscribe } from 'src/app/AutoUnsubscribe';
import {Subscription} from 'rxjs';
import {Utilities} from '../../utils/Utilities';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSourceService} from '../../services/data-source.service';
import {DataSourceI} from '../../interfaces/commonInterfaces';
import {CATEGORY3, CATEGORY1, CATEGORY2} from '../../TableDetails';
import {EditMode} from '../../constants';

@Component({
  selector: 'app-create-new-menu',
  templateUrl: './create-new-menu.component.html',
  styleUrls: ['./create-new-menu.component.scss']
})

@AutoUnsubscribe()
export class CreateNewMenuComponent implements OnInit {
  items!: MenuItem[];
  hideHeaders;
  showSide;
  currentName!: string;
  noItems: boolean;
  dataSourceSub: Subscription;
  init!: boolean;
  utils: Utilities;
  lastDataSub!: Subscription;

  constructor(private service: CommonService, public router: Router,
              public route: ActivatedRoute, private dataService: DataSourceService) {
    this.hideHeaders = true;
    this.showSide = false;
    this.utils = new Utilities();
    this.noItems = true;
    this.dataSourceSub = this.subForDataSourceChange();
  }

  async ngOnInit(): Promise<any> {
    this.currentName = await this.getDataSource();
    this.buildList(this.currentName);
    this.init = true;
  }

  toggleMenu(): void{
    this.showSide = !this.showSide;
  }

  subForDataSourceChange(): Subscription{
    return this.dataService.$dataSource.subscribe((res: DataSourceI|null) => {
      if (res){
        this.currentName = res.name;
        this.buildList(this.currentName);
      }
    });
  }

  buildList(dataSource: string): void{
    const dataSourceName = dataSource.toLowerCase();
    if (dataSourceName.indexOf('fare') > -1){
      this.items = this.buildGroupedItem(CATEGORY1, 'fare');
      this.noItems = false;
      return;
    }
    if (dataSourceName.indexOf('member') > -1){
      this.noItems = false;
      this.items = this.buildGroupedItem(CATEGORY2, 'member');
      return;
    }

    if (dataSourceName.indexOf('error') > -1){
      this.noItems = false;
      this.items = this.buildGroupedItem(CATEGORY3, 'error');
      return;
    }
    this.items = [];
  }

  buildGroupedItem(tableDetails: any, parentRoute: string): MenuItem[]{
    let createNewItems: MenuItem[] = [];
    const groups: string[] = [];

    for (const t in tableDetails){
      if (tableDetails.hasOwnProperty(t)){
        const deets = tableDetails[t];
        for (const key in deets) {
          if (key === 'group') {
            if (groups.indexOf(deets[key]) === -1) {
              groups.push(deets[key]);
            }
          }
        }
      }
    }

    groups.forEach((item) => {
      const mItem: MenuItem = {
        label: item,
        items: []
      };
      createNewItems.push(mItem);
    });

    for (const tableDetailsKey in tableDetails){
      if (tableDetails.hasOwnProperty(tableDetailsKey)){
        const table = tableDetails[tableDetailsKey];
        const parentItem = createNewItems.find((i: MenuItem) => i.label === table.group);
        if (parentItem !== undefined && parentItem.items){

          const text = table.name;
          const result = text.replace(/([A-Z])/g, ' $1');
          const finalResult = (result.charAt(0).toUpperCase() + result.slice(1)).trim();

          parentItem.items.push({
            label: finalResult,
            routerLink: [`${parentRoute}/${table.name[0].toLowerCase() + table.name.substring(1)}/details`],
            queryParams: {
              mode: EditMode.NEW
            },
            command: () => {this.toggleMenu(); }
          });
        }
      }
    }
    createNewItems = this.sortAlpha(createNewItems);

    createNewItems.forEach((groupItem) => {
      groupItem.items = this.sortAlpha(groupItem.items);
    });

    return createNewItems;
  }

  async getDataSource(): Promise<any>{
    return new Promise((resolve, reject) => {
      const lastDataSource: DataSourceI|null = this.dataService.getLastRecordedDataSource();
      if (lastDataSource) {
        resolve(lastDataSource.name);
      } else {
        this.lastDataSub = this.dataService.$lastDataSourceData.subscribe((data) => {
          if (data) {
            resolve(data.name);
          }
        });
      }
    });
  }

  sortAlpha(list: MenuItem[]| undefined): any {
    if (list) {
      // @ts-ignore
      list.sort((a: MenuItem, b: MenuItem) => a.label.localeCompare(b.label));
      return list;
    }
    return undefined;
  }
}
