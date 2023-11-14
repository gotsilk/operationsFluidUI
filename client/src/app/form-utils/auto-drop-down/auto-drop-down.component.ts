import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ApiServiceI} from '../../interfaces/api-serviceI';
import {FKSetRS, GetTableDataRqI} from '../../interfaces/commonInterfaces';
import {Debugging} from '../../Debugging';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../modals/modal.service';
import {EditMode} from '../../constants';


@Component({
  selector: 'su-auto-drop-down',
  templateUrl: './auto-drop-down.component.html',
  styleUrls: ['./auto-drop-down.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AutoDropDownComponent
    }
  ]
})
export class AutoDropDownComponent implements OnInit, ControlValueAccessor {

  @Input() tableName!: string;
  @Input() service!: ApiServiceI;
  @Input() bulkMode: boolean|undefined;

  data!: FKSetRS[];
  searchResults!: FKSetRS[];
  init!: Promise<boolean>;
  currentSelection: any;
  ogValue: any;
  debugging = Debugging.debugEnabled;
  isDisabled: boolean;

  onTouched = () => {};
  onChange =  (model: any) => {};

  constructor(private router: Router, private route: ActivatedRoute, private modalService: ModalService) {
    this.isDisabled = false;
    this.ogValue = null;
  }

  async ngOnInit(): Promise<any> {
    this.init = new Promise<boolean>(async (resolve, reject) => {
      if (!this.data) {
        const rq: GetTableDataRqI = {
          tableName: this.tableName
        };
        this.data = await this.service.getFkIdsDisplayName(rq);
      }
      resolve(true);
    });
  }

  clear(): void {
    this.currentSelection = null;
    this.onChange(this.currentSelection);
  }

  allResults(): void {
    this.searchResults = this.data.filter((i) => {
      return i;
    });
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

  writeValue(obj: any): void {
    this.init.then(() => {
      this.currentSelection = obj;
      if (this.currentSelection){
        const item: FKSetRS|undefined = this.data.find((it) => {
          return it.id === this.currentSelection;
        });
        if (item) {
          this.search({query: item.display}, true);
        }
      }
    });
  }

  search(event: any, preselect?: boolean): void{
    if (event && event.query) {
      const query = event.query.toLowerCase();
      this.searchResults = this.data.filter((item: FKSetRS) => {
        return item.display.trim().toLowerCase().includes(query.toLowerCase());
      });
    }else {
      this.allResults();
    }
    // pre popping and updating the model
    if (preselect) {
      if (this.searchResults && this.searchResults.length > 0) {
        this.currentSelection = this.searchResults.find((item: any) => {
          if (item.display === event.query) {
            return item;
          }
        });
        if (this.currentSelection) {
          this.onChange(this.currentSelection.id);
        }
      }
    }
  }

  async navigate(): Promise<void>{
    const res = await this.modalService.openConfirmModal('Navigating away from current page. Changes will be lost', 'Are you sure you want to proceed');
    if (res) {
      this.router.navigate([`../../${this.tableName}/details`],
        {
          relativeTo: this.route,
          queryParams: {
            mode: EditMode.EDIT,
            id: this.currentSelection.id
          }
        });
    }
  }

  suOnchange(model: any): any{
    if (model === undefined || model === null || model === ''){
      return this.onChange('');
    }
    this.onChange(model?.id);
  }
}
