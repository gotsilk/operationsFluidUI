package com.kylesilk.database


import org.grails.datastore.gorm.GormEntity

class DomainMappingCmd {
    List<com.kylesilk.operations.common.ServerSideErrorRS> errorRSList
    GormEntity entity
    List<com.kylesilk.operations.common.KeyVal> changedCols = []
    List<com.kylesilk.operations.common.ColValueChange> colValueChangeList = [];

    DomainMappingCmd(){
        errorRSList = new ArrayList<>()
    }

}
