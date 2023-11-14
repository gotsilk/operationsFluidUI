package com.kylesilk.database

import grails.validation.Validateable

class DomainStructureRQ implements Validateable{
    String domainName
//    String database

    static constraints = {
        domainName(nullable: false)
//        database(nullable: false, inList: ['fare','member','error'])
    }
}
