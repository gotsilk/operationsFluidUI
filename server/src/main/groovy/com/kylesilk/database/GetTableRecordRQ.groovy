package com.kylesilk.database

import grails.validation.Validateable

class GetTableRecordRQ implements Validateable{
    String dataSource
    String ident
    String tableName

    static constraints = {
        ident(nullable: true)
    }
}
