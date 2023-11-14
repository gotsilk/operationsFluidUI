import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {BulkEditRQ, BulkEditRSI, ColumnStructureI, DomainStructureI} from '../interfaces/commonInterfaces';
import {RowNode} from 'ag-grid-community';
import { FormControl, FormGroup} from '@angular/forms';
import {ApiServiceI} from '../interfaces/api-serviceI';
import {SuMessageService} from '../services/su-message.service';
import {KeyValue} from '@angular/common';
import {ColTypes} from '../constants';
import {Debugging} from '../Debugging';
import {Utilities} from '../utils/Utilities';

interface DropDownI {
  label: string;
  value: any;
  type: any;
}

@Component({
  selector: 'su-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.css']
})
export class BulkEditComponent implements OnChanges {

  dropDownList: DropDownI[] = [];
  selectedItem!: DropDownI;
  bulkValue: any;

  @Input()rows!: any[];
  @Input()tableStructure!: DomainStructureI;
  @Output()newEditVals; // new value
  @Input() blackList!: string[];
  @Input() id: any;
  @Input() api!: ApiServiceI;
  @Input() tableName!: string;

  tableRows!: RowNode[];
  form!: FormGroup;
  col!: ColumnStructureI;
  resetting: boolean;
  debugging = Debugging.debugEnabled;

  constructor(private suMessage: SuMessageService) {
    this.resetting = true;
    this.newEditVals = new EventEmitter<any>();
    this.form = new FormGroup({});
  }


  setCol(dropDownItem: DropDownI): void{
    this.resetting = true;
    if (this.col){
      this.form.removeControl(this.col.columnName);
    }
    // @ts-ignore
    this.col = this.tableStructure.cols.find((col: ColumnStructureI) => col.columnName === dropDownItem.value);

    if (this.col) {
      let formControl = new FormControl();
      formControl = Utilities.setValidation(formControl, this.col);
      this.form.addControl(this.col.columnName, formControl);
    }

    setTimeout(() => {
      this.resetting = false;
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    const rowsKey = 'rows';
    const tableStructureKey = 'tableStructure';

    if (changes[rowsKey]){
      if (!changes[rowsKey].firstChange){
        this.tableRows = changes[rowsKey].currentValue;
      }
    }

    if (changes[tableStructureKey]) {
      const tableS: SimpleChange = changes[tableStructureKey];
      if (tableS.currentValue) {
        tableS.currentValue.cols.forEach((el: ColumnStructureI) => {
          // 'sets' are FK relationships...never wanna get involved in that
          if (!this.blackList.includes(el.columnName) && el.columnType !== 'set') {
              const dropDownEl: DropDownI = {
              label: el.columnName,
              value: el.columnName,
              type: el.columnType
            };
              this.dropDownList.push(dropDownEl);
          }
        });
      }
    }
  }

  get ColTypes(): typeof ColTypes {
    return  ColTypes;
  }

  async save(): Promise<any>{
    const rowIds: any[] = [];

    const rowIdName = this.tableStructure.cols.find((col: ColumnStructureI) => {
      return col.isId;
    })?.columnName;

    if (rowIdName) {
      this.rows.forEach((row => {
        rowIds.push(row[rowIdName]);
      }));
    }

    if (this.col) {
      this.bulkValue = this.form.controls[this.col.columnName].value;
    }else {
      return null;
    }


    const rq: BulkEditRQ = {
      colVal: {
        colName: this.selectedItem.value,
        colVal: this.bulkValue
      },
      ids: rowIds,
      tableName: this.tableName
    };
    const res: BulkEditRSI = await this.api.bulkSave(rq);
    if (res.success){
      const ids: any[] = [];
      res.rowStatus.forEach((item: KeyValue<any, any>) => {
        ids.push(item.key);
      });
      this.suMessage.addSuccess('Bulk Save Success', `Updated IDs: ${ids.toString()}`);
    }

    this.bulkValue = null;
    this.newEditVals.emit(true);
  }
}
