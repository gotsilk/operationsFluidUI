package com.kylesilk.operations.common

class NameValueSet {
    String colName
    Object colVal


    @Override
    String toString(){
        return "$colName: $colVal"
    }
}
