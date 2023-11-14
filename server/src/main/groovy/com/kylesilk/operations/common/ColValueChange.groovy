package com.kylesilk.operations.common

class ColValueChange {
    String colName
    Object oldValue
    Object newValue

    @Override
    String toString(){
        return "$colName: old-$oldValue: new-$newValue"
    }
}
