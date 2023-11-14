import { Component } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {CommonService} from '../../services/common.service';
import {ModalService} from '../../modals/modal.service';
import {TableLookupComponent} from '../../modals/table-lookup/table-lookup.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

  constructor(public commonApi: ApiService, private commonService: CommonService, private modalService: ModalService) { }

  logout(): any{
    this.commonApi.logout().finally(() => {
      window.location.reload();
    });
  }

  exportDataEvent(): void{
      this.commonService.exportDataEvent(true);
  }

  navigateToFluid(): void{
    this.commonService.navigateToFluidTableEvent(true);
  }

  async openTableLookupModal(): Promise<void>{
    const config = {
      minWidth : '500px'
    };
    await this.modalService.openGenericMatModal(TableLookupComponent, config);
  }
}
