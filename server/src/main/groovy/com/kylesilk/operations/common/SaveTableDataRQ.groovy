package com.kylesilk.operations.common

import grails.validation.Validateable


class SaveTableDataRQ implements Validateable{
    String userName
    String data
    String tableKey

    static constraints  = {
        userName(nullable: false)
        data(nullable: false)
        tableKey(nullable: false)
    }
}
