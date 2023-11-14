import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { ColumnStructureI, DomainStructureI} from '../interfaces/commonInterfaces';
import { constant} from '../constants';
import {ColDef} from 'ag-grid-community';

export class Utilities {

  static skipCols: string[] = ['dateCreated', 'lastUpdated'];

  static chunk(arr: any[], size: any): any[] {
    const newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  static deChunk(arr: any[][]): any[] {
    const newArr: any[] = [];
    arr.forEach((a: any[]) => {
      a.forEach((aa: any) => {
        newArr.push(aa);
      });
    });
    return newArr;
  }

  static camelToUnderscore(key: string): string{
    const result = key.replace( /([A-Z])/g, ' $1' );
    return result.split(' ').join('_');
  }


  static makeList(input: string): any {
    if (input) {
      try {
        // number list,
        return JSON.parse(input);
      } catch (e) {
        // string list
        let result: any;
        input = input.replace('[', '').replace(']', '');
        result = input.split(',').map((el: string) => {
          return el.trim();
        });
        return result;
      }
    }
  }

  static determineIfTextAreaShown(colStructureData: ColumnStructureI[][], rowData: any): any{
    for (const chunk of colStructureData) {
      for (const row of chunk) {
        if (row.constraints.widget === 'textarea'){
          row.constraints.hardTextArea = true;
          continue;
        }
        row.constraints.textAreaBool = !!(rowData && rowData[row.columnName] &&
          rowData[row.columnName].length >= constant.AUTO_TEXTAREA_THRESH_HOLD);
      }
    }
    return colStructureData;
  }

  static setFormValues(formG: FormGroup, rowData: any[], tableStructure: DomainStructureI , blackListNames?: string[]): FormGroup{
    for (const key in rowData){
      if (rowData.hasOwnProperty(key)) {
        try {
          if (!blackListNames || blackListNames && blackListNames.indexOf(key) === -1) {
            const control: AbstractControl = formG.controls[key];
            if (control) {
              if (rowData[key] != null) {
                  // for the relations that come in obj format of ID
                  if (rowData[key].id){
                    control.setValue(rowData[key].id);
                  }else {
                    control.setValue(rowData[key]);
                  }
                } else {
                  // @ts-ignore
                  if (tableStructure.cols.find((x: ColumnStructureI) => x.columnName === key).columnType === 'boolean') {
                    control.setValue(false);
                  } else {
                    // set nulls for strings and numbers
                    control.setValue(rowData[key]);
                  }
              }
            }
          }
        } catch (e) {
          console.error(`error setting key: ${key}`, e);
        }
      }
    }
    return formG;
  }

  static getDbType(name: string): string{
    if (name.indexOf('fare') > -1){
      return 'fare';
    }else if (name.indexOf('member') > -1){
      return 'member';
    }else {
      return 'error';
    }
  }

  static buildForm(tableStructure: DomainStructureI, blackList?: string[]): FormGroup{
    const formGroup: FormGroup = new FormGroup({});
    for (const col of tableStructure.cols){
      // skip blacklisted cols
      if (blackList && blackList.includes(col.columnName)){
        continue;
      }
      const validators: ValidatorFn[] = [];
      const control = new FormControl();
      if (col.constraints.maxsize) {
        validators.push(Validators.maxLength(Number(col.constraints.maxsize)));
      }
      if (typeof col.constraints.nullable !== 'undefined' && col.constraints.nullable.toLowerCase() === 'false'){
        validators.push(Validators.required);
      }
      if (col.constraints.matches){
        validators.push(Validators.pattern(col.constraints.matches));
      }
      if (col.columnType === 'boolean'){
        control.setValue(false);
      }
      if (col.constraints.max){
        validators.push(Validators.max(Number(col.constraints.max)));
      }

      if (col.constraints.min){
        validators.push(Validators.min(Number(col.constraints.min)));
      }


      control.setValidators(validators);
      formGroup.addControl(col.columnName, control);
    }
    formGroup.disable();
    return formGroup;
  }

  // todo use this above too
  static setValidation(formControl: FormControl, col: ColumnStructureI): FormControl {
    const validators: ValidatorFn[] = [];
    if (col.constraints.maxsize) {
      validators.push(Validators.maxLength(Number(col.constraints.maxsize)));
    }
    if (typeof col.constraints.nullable !== 'undefined' && col.constraints.nullable.toLowerCase() === 'false'){
      validators.push(Validators.required);
    }
    if (col.constraints.matches){
      validators.push(Validators.pattern(col.constraints.matches));
    }
    if (col.columnType === 'boolean'){
      formControl.setValue(false);
    }
    if (col.constraints.max){
      validators.push(Validators.max(Number(col.constraints.max)));
    }

    if (col.constraints.min){
      validators.push(Validators.min(Number(col.constraints.min)));
    }

    formControl.setValidators(validators);
    return formControl;
  }

  cloneData(obj: any): any{
    return Object.assign({}, obj);
  }

  deleteVersionProperty(obj: any): any{
    if (obj.hasOwnProperty('version')){
      delete obj.version;
    }
    return obj;
  }

}
