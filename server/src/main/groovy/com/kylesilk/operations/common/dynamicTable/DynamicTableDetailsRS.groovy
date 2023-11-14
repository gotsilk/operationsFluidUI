package com.kylesilk.operations.common.dynamicTable

import com.kylesilk.operations.common.KeyVal
import groovy.sql.GroovyRowResult

class DynamicTableDetailsRS {
    String pkName
    String pkType
    List<KeyVal> cols
    GroovyRowResult data


    @Override
    String toString(){
        return "$pkName $pkType $cols $data"
    }
}
