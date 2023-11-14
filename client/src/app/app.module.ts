import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DataSourceModalComponent} from './modals/data-source-modal/data-source-modal.component';
import {ViewCategory2TablesComponent} from './category2/view-category2-tables/view-category2-tables.component';
import {SuInputValidationDirective} from './utils/directives/su-input-validation.directive';
import {CompareModalComponent} from './modals/compare-modal/compare-modal.component';
import {SpacesPipe} from './utils/pipes/spacesPipe';
import {BulkEditComponent} from './bulk-edit/bulk-edit.component';
import {ChangeHeadersModalComponent} from './modals/change-headers-modal/change-headers-modal.component';
import {SuAuthWatcherComponent} from './utils/su-auth-watcher/su-auth-watcher.component';
import {SuAuthDirective} from './utils/directives/su-auth.directive';
import {JsonViewerComponent} from './modals/json-viewer/json-viewer.component';
import {GenericModalComponent} from './modals/generic-modal/generic-modal.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {ToastModule} from 'primeng/toast';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {TabMenuModule} from 'primeng/tabmenu';
import {SidebarModule} from 'primeng/sidebar';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MessageModule} from 'primeng/message';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {BlockUIModule} from 'primeng/blockui';
import {PanelModule} from 'primeng/panel';
import {AgGridModule} from 'ag-grid-angular';
import {NgxSpinnerModule} from 'ngx-spinner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {DatePipe, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RoutingChangeService} from './services/routing-change.service';
import {ProgressBarModule} from 'primeng/progressbar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ChipsModule} from 'primeng/chips';
import { ViewCategory2TableRowsComponent } from './category2/view-category2-table-rows/view-category2-table-rows.component';
import {SlideMenuModule} from 'primeng/slidemenu';
import { ViewCategory3TablesComponent } from './category3/view-member-tables/view-category3-tables.component';
import { ViewCategory3TableRowsComponent } from './category3/view-member-table-rows/view-category3-table-rows.component';
import {MessagesModule} from 'primeng/messages';
import {HttpErrorInterceptor} from './interceptors/HttpError.interceptor';
import { ViewCategory1TablesComponent } from './category1/view-category1-tables/view-category1-tables.component';
import { ViewCategory1TableRowsComponent } from './category1/view-category1-table-rows/view-category1-table-rows.component';
import {ChipModule} from 'primeng/chip';
import {TooltipModule} from 'primeng/tooltip';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {SuPropertiesService} from './services/su-properties.service';
import {initServiceFactory} from './services/init-service.factory';
import {ViewTableRowsComponent} from './table-rows/view-table-rows/view-table-rows.component';
import {TableModule} from 'primeng/table';
import { AgCellDisplayComponent } from './ag-grid-components/ag-cell-display/ag-cell-display.component';
import {AgCellDataSourceRendererComponent} from './ag-grid-components/ag-cell-data-source-renderer/ag-cell-data-source-renderer.component';
import {DragDropModule} from 'primeng/dragdrop';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import {CheckboxModule} from 'primeng/checkbox';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MenuModule} from 'primeng/menu';
import {HttpISODateParserInterceptor} from './interceptors/HttpISODateParser.interceptor';
import {PickListModule} from 'primeng/picklist';
import { ValigatorModalComponent } from './modals/valigator-modal/valigator-modal.component';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {DialogModule} from 'primeng/dialog';
import { CanViewComponent } from './can/can-view/can-view.component';
import { TableLookupComponent } from './modals/table-lookup/table-lookup.component';
import { IndexComponent } from './components/index/index.component';
import {CreateNewMenuComponent} from './components/create-new-menu/create-new-menu.component';
import {FormErrorMessageComponent} from './form-utils/form-error-message/form-error-message.component';
import {NavComponent} from './components/nav/nav.component';
import {TableMenuComponent} from './components/table-menu/table-menu.component';
import {GenericFormInteractionComponent} from './form-utils/generic-form-interaction/generic-form-interaction.component';
import {AutoDropDownComponent} from './form-utils/auto-drop-down/auto-drop-down.component';
import {UniversalDetailsComponent} from './components/universal-details/universal-details.component';
import {TableRowDetailsActionsComponent} from './components/table-row-details-actions/table-row-details-actions.component';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {SqlEditorComponent} from './components/sql-editor/sql-editor.component';
import { ValigatorFieldComponent } from './form-utils/valigator-field/valigator-field.component';
import {DataViewModule} from 'primeng/dataview';
import {FkPointerComponent} from './components/fk-pointer/fk-pointer.component';
import { DynamicTableListComponent } from './dynamicTable/dynamic-table-list/dynamic-table-list.component';
import { SelectTableModalComponent } from './modals/select-table-modal/select-table-modal.component';
import { DynamicTableDetailComponent } from './dynamicTable/dynamic-table-detail/dynamic-table-detail.component';
import {Router} from '@angular/router';

import { AccessDeniedComponent } from './access-denied/access-denied.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ViewCategory2TablesComponent,
    DataSourceModalComponent,
    SuInputValidationDirective,
    CompareModalComponent,
    SpacesPipe,
    BulkEditComponent,
    ChangeHeadersModalComponent,
    NavComponent,
    CreateNewMenuComponent,
    FormErrorMessageComponent,
    JsonViewerComponent,
    SuAuthDirective,
    SuAuthWatcherComponent,
    GenericModalComponent,
    TableMenuComponent,
    GenericFormInteractionComponent,
    ViewCategory2TableRowsComponent,
    ViewCategory3TablesComponent,
    ViewCategory3TableRowsComponent,
    ViewCategory1TablesComponent,
    ViewCategory1TableRowsComponent,
    AutoDropDownComponent,
    UniversalDetailsComponent,
    TableRowDetailsActionsComponent,
    SqlEditorComponent,
    UserMenuComponent,
    ViewTableRowsComponent,
    AgCellDisplayComponent,
    AgCellDataSourceRendererComponent,
    ValigatorModalComponent,
    CanViewComponent,
    TableLookupComponent,
    ValigatorFieldComponent,
    FkPointerComponent,
    DynamicTableListComponent,
    SelectTableModalComponent,
    DynamicTableDetailComponent,
    AccessDeniedComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatTabsModule,
        ToastModule,
        TabMenuModule,
        BreadcrumbModule,
        MatSnackBarModule,
        MatDialogModule,
        MatBottomSheetModule,
        AgGridModule.withComponents([AgCellDisplayComponent]),
        MatButtonModule,
        MatIconModule,
        SidebarModule,
        MatListModule,
        NgxSpinnerModule,
        FormsModule,
        MatCheckboxModule,
        InputTextModule,
        MatCardModule,
        InputTextareaModule,
        ReactiveFormsModule,
        MessageModule,
        CalendarModule,
        MatFormFieldModule,
        MatSelectModule,
        DropdownModule,
        MatTooltipModule,
        MatTableModule,
        BlockUIModule,
        PanelModule,
        NgxJsonViewerModule,
        MatDividerModule,
        ProgressBarModule,
        AutoCompleteModule,
        ChipsModule,
        SlideMenuModule,
        MessagesModule,
        ChipModule,
        TooltipModule,
        CodemirrorModule,
        MatSlideToggleModule,
        MatMenuModule,
        TableModule,
        DragDropModule,
        RippleModule,
        StyleClassModule,
        CheckboxModule,
        SplitButtonModule,
        ConfirmDialogModule,
        MenuModule,
        DynamicDialogModule,
        PickListModule,
        DialogModule,
        DataViewModule
    ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy},
              {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
              {provide: HTTP_INTERCEPTORS, useClass: HttpISODateParserInterceptor, multi: true },
    MessageService, DatePipe, RoutingChangeService, SuPropertiesService,
              {provide: APP_INITIALIZER, useFactory: initServiceFactory,
                deps: [SuPropertiesService, Router], multi: true},
              ConfirmationService, DialogService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DataSourceModalComponent, CompareModalComponent, ChangeHeadersModalComponent, ValigatorModalComponent]
})
export class AppModule { }
