package com.kylesilk.operations.controllers.superuser

import com.kylesilk.operations.database.SuperuserService
import com.kylesilk.operations.property.PropertyService
import groovy.transform.CompileStatic

import java.time.Duration
import java.time.Instant

@CompileStatic
class SuperUserInterceptor {

    final static String enabled = 'superuser.roles'

    static Instant start

    PropertyService propertyService
    SuperuserService superuserService

    boolean before() {
        start = Instant.now()
        return superuserService.isAuthorized(propertyService.getList(enabled))
    }

    boolean after() {
        log.info ("execution time of action $params.action was ${Duration.between(start,Instant.now()).toMillis()} ms")
        true
    }
}
