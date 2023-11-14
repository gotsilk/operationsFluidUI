import {KeyValue} from '@angular/common';
import {TableGroups} from '../TableGroups';

export interface DataSourceI {
  name: string;
  url: string;
  type?: string;
}

export interface DomainStructureI {
  cols: ColumnStructureI[];
}

export interface ColumnStructureI {
  columnName: string;
  columnType: string;
  constraints: ConstraintsStructureI;
  isId: boolean;
}

export interface ConstraintsStructureI {
  maxsize?: string;
  max?: string;
  min?: string;
  nullable?: string;
  pattern?: string;
  inlist?: string;
  timePicker?: boolean;
  textAreaBool?: boolean;
  widget?: any;
  matches?: string;
  hardTextArea?: boolean;
}

export interface ChangeDiffI {
  field: string;
  oldVal: any;
  newVal: any;

}

export interface CompareModalDataI {
  newModel: any;
  originalModel: any;
  dataModel: DomainStructureI;
}

export interface SaveRecordI {
  id?: any;
  dataSource?: string|null;
  tableName?: string;
  skipId?: boolean;
  formValue?: any;
}

export interface SaveRecordRSI {
  errors: SaveRowErrorI[];
  domainObj: any;
  backendMsg?: string;
  success: any;
  id: any;
  backEndErrors: ServerSideErrorRSI[];
}

export interface SaveRowErrorI{
  columnName: string;
  rejectedValue: string;
}

export interface NameValueSetI {
  colName: string;
  colVal: any;
}

export interface TableNameI {
  label: string;
  name: string;
}

export interface GetTableDataRqI {
  dataSource?: string|null;
  ident?: any;
  idString?: string;
  tableName: string;
}

export interface TableDetailConstI {
  route: string;
  objKeyStore: string;
  name: string;
  icon: string;
  idColName: string;
  label: string;
  univ?: boolean;
  enableIdChange?: boolean;
}

export interface FKSetRS{
  id: string|number;
  display: string;
}

export interface SaveTableDataRQI {
  data: string;
  tableKey: string;
}

export interface GetStoredTableData {
  tableKey: string;
}

export interface BulkEditRQ{
  ids: any[];
  colVal: NameValueSetI;
  tableName: string;
  dataSource?: string|null;
}

export interface BulkEditRSI {
  success: boolean;
  rowStatus: KeyValue<any, any>[];
}

export interface DataSourcePartsI {
  region: string;
  environment: string;
  type: string;
}

export interface ServerSideErrorRSI {
  colName: string;
  attemptedColVal: string;
  errorMsg: string;
}

export interface SaveDynamicContentRQ {
  name: string;
  id: number;
  type: string;
  dataSource?: string;
  valigatorKey: string;
  assignedIds: number[];
}

export interface DragDropPlacementI {
  id: number;
  placementCode: number;
  comments: string;
  enabled: boolean;
  filterText?: string;
}

export interface ServerListI {
  url: string;
  flushing: boolean;
}

export interface TableI {
  name: string;
  icon: string;
  group: TableGroups;
  idColName: string;
  univ: boolean;
  enableIdChange?: boolean;
  fkList?: any;
}


