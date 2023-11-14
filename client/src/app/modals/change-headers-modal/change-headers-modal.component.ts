import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-change-headers-modal',
  templateUrl: './change-headers-modal.component.html',
  styleUrls: ['./change-headers-modal.component.css']
})
export class ChangeHeadersModalComponent {

  headersChunked: ChangeHeaderDisplayI[];
  searchTxt: any;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef) {
    const formattedHeaders: ChangeHeaderDisplayI[]  = [];
    this.data.headerList.forEach((header: ColDef) => {
      if (header.headerName) {
        const h: ChangeHeaderDisplayI = {
          name: header.headerName,
          checked: !header.hide
        };
        formattedHeaders.push(h);
      }
    });

    this.headersChunked = formattedHeaders;
  }

  apply(): any{
    this.headersChunked.forEach((header) => {
      this.data.headerList.find((item: ColDef) => {
        if (item.headerName && item.headerName === header.name){
          item.hide = !header.checked;
        }
      });
    });

    this.bottomSheetRef.dismiss(this.data.headerList);
  }
}


export interface ChangeHeaderDisplayI {
  name: string;
  checked: boolean;
}
