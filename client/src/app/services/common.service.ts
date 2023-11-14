import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MenuItem} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  private dataSourceData = new BehaviorSubject(null);
  $dataSource = this.dataSourceData.asObservable();

  private navigateData = new BehaviorSubject<MenuItem|false>(false);
  $navData = this.navigateData.asObservable();

  private showChangeHeadersData = new BehaviorSubject(false);
  $showChangeHeaders = this.showChangeHeadersData.asObservable();

  private showCreateNewMenuData = new BehaviorSubject(true);
  $showCreateNewMenu = this.showCreateNewMenuData.asObservable();

  private currentTableSelected = new BehaviorSubject(null);
  $currentTableSelected = this.currentTableSelected.asObservable();

  private openChangeHeaderData = new BehaviorSubject(false);
  $openChangeHeader = this.openChangeHeaderData.asObservable();

  private closeMenuSidePanelData = new BehaviorSubject(false);
  $closeMenuSidePanel = this.closeMenuSidePanelData.asObservable();

  private canViewData = new BehaviorSubject(false);
  $canView = this.canViewData.asObservable();

  private canEditData = new BehaviorSubject(false);
  $canEdit = this.canEditData.asObservable();

  private exportCsvEventData = new BehaviorSubject(false);
  $exportCsvEvent = this.exportCsvEventData.asObservable();

  private fluidTableNavData = new BehaviorSubject(false);
  $fluidTableNavEvent = this.fluidTableNavData.asObservable();

  updateDataSource(dataSource: any): void{
    this.dataSourceData.next(dataSource);
  }

  updateNavDate(navData: any): void{
    this.navigateData.next(navData);
  }

  showChangeHeader(show: boolean): void{
    this.showChangeHeadersData.next(show);
  }

  showCreateMenu(show: boolean): void{
    this.showCreateNewMenuData.next(show);
  }

  closeSideMenu(): void{
    this.closeMenuSidePanelData.next(true);
  }

  openChangeHeaderSheet(status = false): void{
    this.openChangeHeaderData.next(status);
  }

  updateEditData(data: any): void{
    this.canEditData.next(data);
  }

  updateViewData(data: any): void{
    this.canViewData.next(data);
  }

  exportDataEvent(data: boolean): void{
    this.exportCsvEventData.next(data);
  }

  navigateToFluidTableEvent(data: boolean): void{
    this.fluidTableNavData.next(data);
  }
}
