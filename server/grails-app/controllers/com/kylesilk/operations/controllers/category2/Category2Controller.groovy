package com.kylesilk.operations.controllers.category2

import com.kylesilk.database.FkEnabledI
import com.kylesilk.database.GetTableRecordRQ
import com.kylesilk.operations.common.BulkEditRQ
import com.kylesilk.operations.common.BulkEditRS
import com.kylesilk.operations.common.DataSourceSpecificI
import com.kylesilk.operations.common.FkListRS
import com.kylesilk.operations.common.SaveRowRS
import com.kylesilk.operations.common.SuError
import com.kylesilk.operations.common.dynamicTable.DynamicTableDetailsRS
import com.kylesilk.operations.common.dynamicTable.DynamicTableList
import com.kylesilk.operations.common.dynamicTable.GetTableRQ
import com.kylesilk.operations.database.DomainService
import com.kylesilk.operations.traits.SuDateUnmarshal
import grails.compiler.GrailsCompileStatic
import grails.converters.JSON
import org.springframework.http.HttpStatus

@GrailsCompileStatic
class Category2Controller implements DataSourceSpecificI, SuDateUnmarshal {

    DomainService domainService


    Object getTablesOnDataSource() {
        List<String> tables = domainService.getTablesOnDataSource(params.dataSource as String)
        render tables as JSON
    }

    Object getDomainRecords(GetTableRecordRQ rq){
        List<Object> results = domainService.getTableRows(rq.tableName, rq.ident, rq.dataSource)
        log.info("returning ${results.size()} ${rq.tableName} records")
        if (!results.isEmpty() && results[0] instanceof SuError){
            response.status = HttpStatus.INTERNAL_SERVER_ERROR.value()
        }
        render results as JSON
    }

    Object getFkList(GetTableRecordRQ rq){
        List<FkListRS> rs = []
        List<FkEnabledI> results = domainService.getTableRows(rq.tableName, null , rq.dataSource) as List<FkEnabledI>
        for (FkEnabledI it: results){
            if (it.respondsTo("toDisplay")){
                rs.push(it.toDisplay())
            }else {
                log.error("toDisplay not implemented for this table $rq.tableName")
                break
            }
        }
        render rs as JSON
    }

    Object bulkSave(BulkEditRQ rq){
        parseDateForBulk(rq) // hacky fix here, need to improve overall un-marshalling
        BulkEditRS rs = domainService.bulkEditTable(rq)
        render rs as JSON
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

    DynamicTableDetailsRS getDynamicTableDetail(GetTableRQ rq){
        DynamicTableDetailsRS ret = domainService.getDynamicTableDetail(rq.tableName, rq.dataSource, rq.id)
        render ret as JSON
    }

    List<String> getTables(GetTableRQ rq){
        List<String> tables = domainService.getTablesOnDataSource(rq.dataSource)
        render tables as JSON
    }

}
