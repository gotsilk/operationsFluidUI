package com.kylesilk.operations.controllers.superuser

import com.kylesilk.operations.common.RunSqlScriptRQ
import com.kylesilk.operations.database.DomainService
import grails.converters.JSON
import groovy.sql.GroovyRowResult

class SuperUserController {

    DomainService domainService

    Object executeSql(RunSqlScriptRQ rq){
        if (!rq.validate()) {
            response.status = 400
            render(rq.errors.allErrors as JSON)
            return
        }
            List<GroovyRowResult> results = domainService.runSqlScript(rq)
            render results as JSON
    }



}
