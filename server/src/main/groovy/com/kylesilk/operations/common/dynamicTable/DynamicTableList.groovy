package com.kylesilk.operations.common.dynamicTable

import groovy.sql.GroovyRowResult

class DynamicTableList {
    String pkName
    List<String> colHeaders
    List<GroovyRowResult> data = []
    boolean success = true;

    @Override
    String toString(){
        return "${pkName} $colHeaders $data"
    }
}
