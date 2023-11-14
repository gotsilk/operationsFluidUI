import { Component, OnInit } from '@angular/core';
import {DataSourcePartsI} from '../../interfaces/commonInterfaces';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {SuPropertiesService} from '../../services/su-properties.service';
import {IAfterGuiAttachedParams, ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-ag-cell-data-source-renderer',
  template: '<span>{{formattedData}}</span>',
})
export class AgCellDataSourceRendererComponent implements OnInit, ICellRendererAngularComp {

  regEx!: RegExp;
  formattedData: string|undefined;

  constructor(public propertyService: SuPropertiesService) {
    this.regEx = new RegExp(this.propertyService.getProperty('datasource.regex.matcher'), 'gi');
  }

  ngOnInit(): void {}


  matchDataSourceParts(data: any): any{
    let m;
    const db: DataSourcePartsI = {environment: '', region: '', type: ''};
    db.type = 'no match';
    db.region = 'no match';
    db.environment = 'no match';

    // tslint:disable-next-line:no-conditional-assignment
    while ((m = this.regEx.exec(data)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === this.regEx.lastIndex) {
        this.regEx.lastIndex++;
      }
      db.type = m[1];
      db.region = m[2];
      db.environment = m[3] ? '-' + m[3] : '';

    }
    return `${db.type}-${db.region}${db.environment}`;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  agInit(params: ICellRendererParams): void {
    this.formattedData = this.matchDataSourceParts(params.value);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
