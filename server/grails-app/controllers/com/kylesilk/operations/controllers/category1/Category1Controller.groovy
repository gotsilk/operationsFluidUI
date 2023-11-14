package com.kylesilk.operations.controllers.category1

import com.kylesilk.database.FkEnabledI
import com.kylesilk.database.GetTableRecordRQ
import com.kylesilk.operations.common.BulkEditRQ
import com.kylesilk.operations.common.BulkEditRS
import com.kylesilk.operations.common.DataSourceSpecificI
import com.kylesilk.operations.common.FkListRS
import com.kylesilk.operations.common.SaveRowRS
import com.kylesilk.operations.common.dynamicTable.DynamicTableList
import com.kylesilk.operations.common.dynamicTable.GetTableRQ
import com.kylesilk.operations.database.DomainService
import com.kylesilk.operations.traits.SuDateUnmarshal
import grails.compiler.GrailsCompileStatic
import grails.converters.JSON

@GrailsCompileStatic
class Category1Controller implements DataSourceSpecificI, SuDateUnmarshal{
    DomainService domainService

    Object bulkSave(BulkEditRQ rq) {
        parseDateForBulk(rq) // hacky fix here, need to improve overall un-marshalling
        BulkEditRS rs = domainService.bulkEditTable(rq)
        render rs as JSON
    }

    Object getFkList(GetTableRecordRQ rq) {
        List<FkListRS> rs = []
        List<FkEnabledI> results = domainService.getTableRows(rq.tableName, null , rq.dataSource) as List<FkEnabledI>
        results.each {
            if (it.respondsTo("toDisplay")) {
                rs.push(it.toDisplay())
            } else {
                log.error("toDisplay not implemented for this table $rq.tableName")
                render false
            }
        }
        render rs as JSON
    }

    Object getDomainRecords(GetTableRecordRQ rq) {
        List<Object> results = domainService.getTableRows(rq.tableName, rq.ident, rq.dataSource)
        render results as JSON
    }

    Object saveDomainRecord() {
        Object rq = unmarshalRequest()
        SaveRowRS rs = domainService.saveTableRowData(rq)
        render rs as JSON
    }

    DynamicTableList getDynamicTableList(GetTableRQ rq){
        DynamicTableList ret = domainService.listRawRows(rq.tableName, rq.dataSource)
        render ret as JSON
    }

    List<String> getTables(GetTableRQ rq){
        List<String> tables = domainService.getTablesOnDataSource(rq.dataSource)
        render tables as JSON
    }
}
