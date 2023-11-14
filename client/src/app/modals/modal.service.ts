import {Injectable, Type} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {DataSourceModalComponent} from './data-source-modal/data-source-modal.component';
import {CompareModalComponent} from './compare-modal/compare-modal.component';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {ChangeHeadersModalComponent} from './change-headers-modal/change-headers-modal.component';
import {ColDef} from 'ag-grid-community';
import {JsonViewerComponent} from './json-viewer/json-viewer.component';
import {GenericModalComponent} from './generic-modal/generic-modal.component';
import {DataSourceTypes} from '../constants';
import {ConfirmationService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog/dynamicdialog-config';
import {DynamicDialogRef} from 'primeng/dynamicdialog/dynamicdialog-ref';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  static dsModalInstance: any;

  // todo convert to primeNg modal ONLY no more mix matching
  constructor(public modal: MatDialog, public bottomSheet: MatBottomSheet,
              public confirmationService: ConfirmationService, public dialogService: DialogService) { }

  config: MatDialogConfig = {};

  openChangeDataSource(dst?: DataSourceTypes): Promise<any>{
    if (ModalService.dsModalInstance){
      return ModalService.dsModalInstance;
    }
    const config = this.config;
    config.minWidth = '500px';
    if (dst) {
      config.data = {
        dst
      };
    }
    ModalService.dsModalInstance = this.modal.open(DataSourceModalComponent, this.config).afterClosed().toPromise().finally(() => {
      ModalService.dsModalInstance = null;
    });

    return ModalService.dsModalInstance;
  }

  openGenericMatModal(comp: Type<any>, config: MatDialogConfig): Promise<any>{
    return this.modal.open(comp, config).afterClosed().toPromise();
  }

  openCompareModal(newModel: any, originalModel: any, dataModel: any): Promise<any>{
    const config = this.config;
    config.data = {
      originalModel,
      newModel,
      dataModel
    };
    config.width = '50%';
    return this.modal.open(CompareModalComponent, config).afterClosed().toPromise().then((res: boolean) => {
      return res ? Promise.resolve() : Promise.reject();
    });
  }

  openChangeHeadersBottomSheet(headerList: ColDef[]): Observable<ColDef[]>{
    const config: MatBottomSheetConfig = {
      data: { headerList }
    };
    return this.bottomSheet.open(ChangeHeadersModalComponent, config).afterDismissed();
  }

  openJsonView(tableData: any): any{
    const config = this.config;
    config.data = tableData;
    return this.modal.open(JsonViewerComponent, config).afterClosed();
  }

  openGenericModal(msg: any, canCancel: any): any{
    const config = this.config;
    config.data = {
        msg,
        canCancel
    };
    return this.modal.open(GenericModalComponent, config).afterClosed();
  }

  openConfirmModal(header: string, message: string, acceptLabel: string = 'Yes',  showReject: boolean = true,
                   rejectLabel: string = 'No'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        message,
        acceptLabel,
        rejectLabel,
        rejectVisible: showReject,
        header,
        accept: () => {
          resolve(true);
        },
        reject:  () => {
          resolve(false);
        }
      });
    });
  }

  openDynamicModal(component: Type<any>, config: DynamicDialogConfig): DynamicDialogRef {
    return this.dialogService.open(component, config);
  }
}
