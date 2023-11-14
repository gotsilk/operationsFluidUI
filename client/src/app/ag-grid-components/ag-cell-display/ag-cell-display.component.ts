import { Component } from '@angular/core';
import {DatePipe} from '@angular/common';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {IAfterGuiAttachedParams, ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-ag-cell-display',
  template: '<span>{{formattedData}}</span>',
})
export class AgCellDisplayComponent implements ICellRendererAngularComp {
  dateFormat = 'yyyy-MM-dd';
  formattedData: any;
  dateRegEx = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/;

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  agInit(params: ICellRendererParams): void {
    this.formattedData = this.displayData(params.value);
  }

  refresh(params: any): boolean {
    return false;
  }

  displayData(data: any): any {
    if (typeof data === 'number' || typeof data === 'boolean'){
      return data;
    }

    if (data){
      // try to parse a data here
      try{
        if (data instanceof Date){
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(data, 'shortDate');
        }
      }catch (e){
        // eat it bitch
      }
    }
    return data;
  }
}
