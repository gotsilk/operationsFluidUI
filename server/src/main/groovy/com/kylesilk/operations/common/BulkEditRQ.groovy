package com.kylesilk.operations.common

import grails.validation.Validateable

class BulkEditRQ implements Validateable{
    List<Object> ids
    NameValueSet colVal
    String tableName
    String dataSource


    static constraints = {
        colVal(nullable: true)
    }
}
