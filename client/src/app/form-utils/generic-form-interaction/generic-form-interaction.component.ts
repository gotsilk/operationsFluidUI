import { Component, HostListener, Input } from '@angular/core';
import {Utilities} from '../../utils/Utilities';
import {Debugging} from '../../Debugging';
import {ColumnStructureI} from '../../interfaces/commonInterfaces';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ColTypes, HELPERS} from 'src/app/constants';
import {BehaviorSubject, Observable, timeout} from 'rxjs';


@Component({
  selector: 'su-generic-form-interaction',
  templateUrl: './generic-form-interaction.component.html',
  styleUrls: ['./generic-form-interaction.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: GenericFormInteractionComponent
    }
  ]
})
export class GenericFormInteractionComponent implements ControlValueAccessor {

  textAreaMode: boolean;
  timePickerTimeFormat = '';
  chipViewToggle: boolean;
  ogData: any;
  utilities: Utilities;
  timePickerDate: Date;
  debug = Debugging.debugEnabled;
  isDisabled: boolean;

  modalData: BehaviorSubject<any>;
  $modalDataChange: Observable<any>;
  helperText: string|null;
  datePickerResetter: boolean;


  @Input() col !: ColumnStructureI;
  @Input() parentRest?: any;
  @Input() bulkMode: boolean;
  model: any;
  maxYear: number;
  minYear: number;
  init: boolean;
  chipSplitValue!: any[];
  readOnlyData: any;

  onTouched = () => {};
  onChange =  (model: any) => {};

  constructor() {
    this.init = false;
    this.bulkMode = false;
    const now = new Date();
    this.maxYear = now.getFullYear() + 100;
    this.minYear = now.getFullYear() - 100;
    this.textAreaMode = false;
    this.chipViewToggle = false;
    this.readOnlyData = null;
    this.utilities = new Utilities();
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    this.timePickerDate = date;
    this.isDisabled = false;
    this.modalData = new BehaviorSubject(null);
    this.$modalDataChange = this.modalData.asObservable();
    this.helperText = null;
    this.datePickerResetter = false;

    this.$modalDataChange.subscribe((val) => {
      if (val) {
        this.initialize();
      }
    });
  }

  writeValue(obj: any): void {
    this.model = obj;
    this.modalData.next(true);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }


  @HostListener('mousewheel', ['$event.target'])
  onscroll(): void {
    // @ts-ignore
    if (document.activeElement.type === 'number'){
      // @ts-ignore
      document.activeElement.blur();
    }
  }

  initialize(): void{
    this.ogData = this.model;
    // have the widget override anything
    if (this.col.constraints.widget){
      if (this.col.constraints.widget !== HELPERS.PRICING_TYPE || this.col.constraints.widget !== HELPERS.FILE_TYPE ) {
        this.col.columnType = this.col.constraints.widget;
      }
    }
    // in list most trump card for now
    if (this.col.constraints.inlist){
      this.col.columnType = ColTypes.IN_LIST;
    }

    if (this.col.constraints.textAreaBool === true) {
      this.textAreaMode = true;
    }

    if (this.col.constraints.widget === ColTypes.CHIPS){
      this.model = this.model.replace('[', '').replace(']', '');
      this.setChipValues();
    }

    if (this.col.columnType === ColTypes.READ_ONLY_DATE_PICKER){
      this.getFormControlValue();
    }
    if (this.col.columnType === ColTypes.TIME_PICKER){
      if (this.model) {
        const timeStr = this.model.split(':');
        this.timePickerDate.setHours(timeStr[0]);
        this.timePickerDate.setMinutes(timeStr[1]);
        this.timePickerDate.setSeconds(0);
      }
    }

    this.getHelperText();
    this.init = true;
  }

  checkForDiffValue(): boolean{
    if (!this.bulkMode) {
      return this.model !== this.ogData;
    }
    return false;
  }

  getFormControlValue(): any {
    if (this.model) {
      this.readOnlyData = new Date(this.model);
    }
  }

  public get ColTypes(): typeof ColTypes {
    return ColTypes;
  }

  openSiteNewTab(): void {
    let url = this.model;
    if (url) {
      if (url.indexOf('http') === -1) {
        url = 'https://' + url;
      }
      window.open(url);
    }
  }

  setTIme(date: Date): void{
    this.model = `${date.getHours()}:${date.getMinutes()}:00`;
  }

  suUpdate(event: any): void {
    // if (this.col.columnType === ColTypes.DATE_PICKER){ // clear the time out, only TIME pickers need this to be set
    //   if (event instanceof Date){
    //     event.setHours(0, 0, 0, 0);
    //   }
    // }
    this.onChange(event);
  }

  stringify(event: any): string{
    return event.join(',');
  }

  setChipValues(): void{
    if (this.model) {
      this.chipSplitValue = this.model.split(',');
    }
  }

  sanitizeChipVars(event: any): void{
    if (!(typeof  event === 'string')) {
      // @ts-ignore
      this.model = this.stringify(event).replaceAll(/\s/g, '');
    }else {
      // @ts-ignore
      this.model = event.replaceAll(/\s/g, '');
    }

    this.setChipValues();
    this.onChange(this.model);
  }

  // todo make this better just a quickfix
  getHelperText(): void {
    switch (this.col.constraints.widget){
      case HELPERS.PRICING_TYPE :
        this.helperText = '1=CAT35, 2=Unfiled DOP, 3=CAT25, 4=PUB';
        break;
      case HELPERS.FILE_TYPE :
        this.helperText = '0=ADT, 1=JCB, 2=STU,3=PFA,5=YTH,6=MIS,7=ITX';
        break;
      default: this.helperText = null;
    }
  }

  clearTime(): void {
    this.model.setHours(0, 0, 0, 0);
    this.datePickerResetter = true;
    setTimeout(() =>{
      this.datePickerResetter = false;
    }, 300);
  }
}
