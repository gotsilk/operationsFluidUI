import {BulkEditRQ, FKSetRS, GetTableDataRqI, SaveRecordI, SaveRecordRSI} from './commonInterfaces';

export interface ApiServiceI {
  getFkIdsDisplayName(rq: GetTableDataRqI): Promise<FKSetRS[]>;
  bulkSave(rq: BulkEditRQ): Promise<any>;
  getTableData(rq: GetTableDataRqI): Promise<any>;
  saveDomainRecord(rq: SaveRecordI): Promise<SaveRecordRSI>;
  getTablesOnDataSource(): Promise<any>;
  getDynamicTableRecords(table: string): Promise<any>;
  getDynamicTableRecordDetail(rq: any): Promise<any>;
  }
