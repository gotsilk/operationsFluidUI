package com.kylesilk.operations.utils

import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

class DateValidatorUsingLocalDate implements DateValidator{

    private DateTimeFormatter dateFormatter;

    public DateValidatorUsingLocalDate(DateTimeFormatter dateFormatter) {
        this.dateFormatter = dateFormatter;
    }

    @Override
    public boolean isValid(Object dateStr) {
        if (dateStr instanceof String) {
            try {
                LocalDateTime.parse(dateStr.replace("Z",""), this.dateFormatter);
            } catch (DateTimeParseException e) {
                return false;
            }
            return true;
        }
        return false
    }

    Date convertStringToDate(String dateStr){
        LocalDateTime localDate = LocalDateTime.parse(dateStr.replace("Z",""), this.dateFormatter)
        return Date.from(localDate.atZone(ZoneId.systemDefault()).toInstant())
    }
}
