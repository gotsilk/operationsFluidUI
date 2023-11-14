package com.kylesilk.operations.common

import grails.validation.Validateable

class UpdateTableRQ implements Validateable{
    String id
    String dataSource
    //used for the generic flavor
    String tableName
    List<NameValueSet> colValMap
    Boolean skipId = true

    static constraints = {
        tableName(nullable: false)
        id(nullable: true)
        dataSource(nullable: false)
        colValMap(nullable: false)
    }




    String toSlackLogMsg(){
        String[] skips = ['lastUpdated', 'dateCreated']
        StringBuilder sb = new StringBuilder()
        sb.append("tableName: $tableName\n")
        sb.append("dataSource: $dataSource\n")
        for(NameValueSet nv: colValMap){
            if (nv.colName in skips){
                continue
            }
            sb.append("$nv.colName : $nv.colVal\n")
        }
        return sb.toString()
    }
}
