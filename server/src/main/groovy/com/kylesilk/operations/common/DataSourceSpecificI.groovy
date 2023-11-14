package com.kylesilk.operations.common


import com.kylesilk.database.GetTableRecordRQ

interface DataSourceSpecificI {
    Object bulkSave(BulkEditRQ rq)
    Object getFkList(GetTableRecordRQ rq)
    Object getDomainRecords(GetTableRecordRQ rq)
    Object saveDomainRecord()
    Object getTables(com.kylesilk.operations.common.dynamicTable.GetTableRQ rq)
}
