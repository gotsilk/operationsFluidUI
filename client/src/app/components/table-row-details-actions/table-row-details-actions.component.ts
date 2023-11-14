import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
import { EditMode } from 'src/app/constants';
import {SuPropertiesService} from '../../services/su-properties.service';
import {Debugging} from '../../Debugging';

@Component({
  selector: 'app-table-row-details-actions',
  templateUrl: './table-row-details-actions.component.html',
  styleUrls: ['./table-row-details-actions.component.scss']
})
export class TableRowDetailsActionsComponent {

  @Input() editMode!: boolean;
  @Input() isProd!: boolean;
  @Input() form!: FormGroup;
  @Input() id: any;
  @Input() loadingFlag: boolean;

  @Output() copyChange: EventEmitter<any>;
  @Output() save: EventEmitter<any>;
  @Output() transferRowData: EventEmitter<any>;
  @Output() cancel: EventEmitter<any>;
  @Output() importData: EventEmitter<any>;
  @Output() viewStoredObj: EventEmitter<any>;
  @Output() toggleEdit: EventEmitter<boolean>;
  @Output() transferLocally: EventEmitter<any>;

  toggled: boolean;
  transferRowDataEnabled: boolean;
  transferRowDataLocallyEnabled: boolean;
  currentlyLoading!: string;
  saveBtnLbl: string;
  splitMenu: MenuItem[];
  mode: EditMode;
  debugging = Debugging.debugEnabled;

  constructor(private properties: SuPropertiesService, private route: ActivatedRoute) {
    this.transferRowDataEnabled = this.properties.getProperty('transferDataToServer.enabled');
    this.transferRowDataLocallyEnabled = this.properties.getProperty('transferDataToServer.locally.enabled');
    this.loadingFlag = false;
    this.toggled = false;
    this.cancel = new EventEmitter<any>();
    this.save = new EventEmitter<any>();
    this.transferRowData = new EventEmitter<any>();
    this.copyChange = new EventEmitter<any>();
    this.importData = new EventEmitter<any>();
    this.viewStoredObj = new EventEmitter<any>();
    this.toggleEdit = new EventEmitter<boolean>();
    this.transferLocally = new EventEmitter<any>();
    this.saveBtnLbl = "Save";

    this.splitMenu = [
      {label: 'Preview Data',  icon: 'pi pi-info', command: () => {
          this.viewStoredObj.emit(true);
        }}
    ];

    this.mode = this.route.snapshot.queryParams['mode'];

  }



  get EditMode(): typeof EditMode {
    return EditMode;
  }
}
