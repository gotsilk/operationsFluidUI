package com.kylesilk.operations.common

import grails.validation.Validateable

class RunSqlScriptRQ implements Validateable{
    String dataSource
    String sql

    static constraints = {
        dataSource(nullable: false)
        sql(nullable: false)
    }
}
