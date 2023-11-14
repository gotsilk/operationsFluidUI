package com.kylesilk.operations.common

import org.springframework.validation.FieldError

import java.lang.reflect.Field

class SaveRowError {
    String columnName
    String rejectedValue


    SaveRowError(FieldError error){
        this.columnName = error.field
        this.rejectedValue = error.rejectedValue.toString()
    }

    SaveRowError(Object error){

    }
}
