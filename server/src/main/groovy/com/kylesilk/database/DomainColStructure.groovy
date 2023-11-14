package com.kylesilk.database

class DomainColStructure {
    String columnName
    String columnType
    Boolean isId
    Map<String,String> constraints = [:]
}
