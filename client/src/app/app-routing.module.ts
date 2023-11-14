import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ViewCategory2TablesComponent} from './category2/view-category2-tables/view-category2-tables.component';
import {ViewCategory3TablesComponent} from './category3/view-member-tables/view-category3-tables.component';
import {ViewCategory1TablesComponent} from './category1/view-category1-tables/view-category1-tables.component';
import {ViewTableRowsComponent} from './table-rows/view-table-rows/view-table-rows.component';
import {IndexComponent} from './components/index/index.component';
import {CanViewComponent} from './can/can-view/can-view.component';
import {SqlEditorComponent} from './components/sql-editor/sql-editor.component';
import {DataSourceResolver} from './resolvers/DataSourceResolver';
import {AccessDeniedComponent} from './access-denied/access-denied.component';
import {TableOverviewGuard} from './table-overview.guard';


const routes: Routes = [
  {path: 'index', redirectTo: '', pathMatch: 'full', component: IndexComponent},
  {path: 'importDataRow', component: IndexComponent},
  {path: 'dev-test', component: ViewTableRowsComponent},
  {path: 'can', component: CanViewComponent},
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: 'sql', component: SqlEditorComponent},
  {path: '',  component: IndexComponent},
  {path: 'fare', component: ViewCategory2TablesComponent,
    children: [
      {path: '', redirectTo: 'fare', pathMatch: 'full'},
    ],
    resolve: {dataSource: DataSourceResolver}, canActivate: [TableOverviewGuard]
  },
  {path: 'member', component: ViewCategory3TablesComponent,
    children: [
      {path: '', redirectTo: 'member', pathMatch: 'full'},
    ], resolve: {dataSource: DataSourceResolver}, canActivate: [TableOverviewGuard]},
  {path: 'error', component: ViewCategory1TablesComponent,
    children: [
      {path: '', redirectTo: 'error', pathMatch: 'full'},
    ],
    resolve: {dataSource: DataSourceResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
