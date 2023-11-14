import {DomainStructureI, TableDetailConstI} from './commonInterfaces';
import {ApiServiceI} from './api-serviceI';
import {EditMode} from '../constants';

export interface TableDetailsI {

  dataStructureModel: DomainStructureI;
  enableIdChange: any;
  tableKey: any;
  tableName: string;
  blackList: string[];
  idName: any;
  dataSourceName?: any;
  skipId: boolean;
  rest: ApiServiceI;
  tableConst: any;
  mode: EditMode|undefined;

  getRecordData(): Promise<any>;

  getDataStructureModel(tableName: string, id: any, dataSource: string, rowAction: any): any;

}
