package com.kylesilk.database.dynamiccontent

import grails.validation.Validateable

class SaveDynamicContentRQ  implements Validateable{
    String name
    Long id
    String type
    String dataSource
    String valigatorKey
    List<Long> assignedIds


    static constraints = {
        assignedIds(nullable: true)
        id(nullable: true)
    }
}
