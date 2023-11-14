package com.kylesilk.operations.utils

interface DateValidator {
    boolean isValid(Object dateStr);
    Date convertStringToDate(String dateStr)
}
