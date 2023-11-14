import {SuPropertiesService} from './su-properties.service';
import {Debugging} from '../Debugging';
import {Route, Router} from '@angular/router';
import {CATEGORY3, CATEGORY1, CATEGORY2} from '../TableDetails';
import {ViewCategory2TableRowsComponent} from '../category2/view-category2-table-rows/view-category2-table-rows.component';
import {ViewCategory3TableRowsComponent} from '../category3/view-member-table-rows/view-category3-table-rows.component';
import {ViewCategory1TableRowsComponent} from '../category1/view-category1-table-rows/view-category1-table-rows.component';
import {UniversalDetailsComponent} from '../components/universal-details/universal-details.component';


export function initServiceFactory(propService: SuPropertiesService, router: Router): () => void {
  loadChildRoutes(router);
  return async () => {
    console.log('initServicesFactory - started');
    await propService.getProperties();
    console.log('initServicesFactory - completed');

    // region enable debugging
    Debugging.debugEnabled = !!propService.getProperty('debugger.enable');
    console.log('initServicesFactory - DEBUG SET TO : ' + Debugging.debugEnabled);
    // endregion
  };
}



function loadChildRoutes(router: Router): void {
  setupChildRoutsForTables(router);
}


function setupChildRoutsForTables(router: Router): void{
  for (const tableKey of CATEGORY1) {
    setChildRoute(router, 'fare', ViewCategory2TableRowsComponent, tableKey, tableKey?.univ);
  }
  for (const tableKey of CATEGORY2) {
    setChildRoute(router, 'member', ViewCategory3TableRowsComponent, tableKey, tableKey?.univ);
  }

  for (const tableKey of CATEGORY3) {
    setChildRoute(router, 'error', ViewCategory1TableRowsComponent, tableKey, tableKey?.univ);
  }
}

function setChildRoute(router: Router, dbType: string, rootComponent: any, tableDeets: any, univ: boolean = false): void {
  const config: Route = router.config.find(x => x.path === dbType) as Route;
  const rStr = tableDeets.name[0].toLowerCase() + tableDeets.name.substring(1);
  const childRoute: Route = {path: rStr, component: rootComponent};
  config?.children?.push(childRoute);
  if (univ) {
    const childDeetRoute: Route = {
      path: `${rStr}/details`, component: UniversalDetailsComponent
    };
    config?.children?.push(childDeetRoute);
  }
}
