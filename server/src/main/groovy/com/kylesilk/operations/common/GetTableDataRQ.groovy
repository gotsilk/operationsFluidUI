package com.kylesilk.operations.common

import grails.validation.Validateable

class GetTableDataRQ implements Validateable{
    String tableKey


    static constraints = {
        tableKey(nullable: false)
    }
}
