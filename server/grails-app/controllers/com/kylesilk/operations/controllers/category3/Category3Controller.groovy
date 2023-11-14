package com.kylesilk.operations.controllers.category3

import com.kylesilk.database.FkEnabledI
import com.kylesilk.database.GetTableRecordRQ
import com.kylesilk.database.ResponseEnabledI
import com.kylesilk.database.dynamiccontent.SaveDynamicContentRQ
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
import grails.core.GrailsApplication


@GrailsCompileStatic
class Category3Controller implements DataSourceSpecificI, SuDateUnmarshal {

    DomainService domainService

    GrailsApplication grailsApplication

    static Map<String,String>  specialColtableMappings = [
            parentMiscProduct : 'miscProduct'
    ]

    Object getDomainRecords(GetTableRecordRQ rq){
        List<Object> results = domainService.getTableRows(rq.tableName, rq.ident, rq.dataSource)
        if (results && !results.isEmpty() && results.first().respondsTo('toResponse')){
            List<Object> responseObjs = []
            for (ResponseEnabledI r : results as List<ResponseEnabledI>){
                responseObjs.add(r.toResponse())
            }
            render responseObjs as JSON
        }else {
            render results as JSON
        }
    }

    Object getFkList(GetTableRecordRQ rq){
        List<FkListRS> rs = []
        if (specialColtableMappings.get(rq.tableName) != null){
            rq.tableName = specialColtableMappings.get(rq.tableName)
        }
        List<FkEnabledI> results = domainService.getTableRows(rq.tableName, null , rq.dataSource) as List<FkEnabledI>
        results.each {FkEnabledI item ->
            rs.push(item.toDisplay())
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

    List<String> getTables(GetTableRQ rq){
        List<String> tables = domainService.getTablesOnDataSource(rq.dataSource)
        render tables as JSON
    }

    SaveRowRS saveDynamicContent(SaveDynamicContentRQ rq){
        SaveRowRS res = domainService.saveDynamicContent(rq)
        render res as JSON
    }
}


