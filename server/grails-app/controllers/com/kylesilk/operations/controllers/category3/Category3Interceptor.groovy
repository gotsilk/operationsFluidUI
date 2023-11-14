package com.kylesilk.operations.controllers.category3

import com.kylesilk.operations.database.SuperuserService
import com.kylesilk.operations.property.PropertyService
import groovy.transform.CompileStatic
import org.springframework.http.HttpStatus

import java.time.Duration
import java.time.Instant

@CompileStatic
class Category3Interceptor {

    //todo fix prop names later on
    final static String canEditRoles = 'member.editing.roles'
    final static String canViewRoles = 'member.viewing.roles'
    static Instant start

    PropertyService propertyService
    SuperuserService superuserService

    boolean before() {
        start = Instant.now()
        boolean access
        if (actionName.toLowerCase().contains('save')){
            access = superuserService.isAuthorized(propertyService.getList(canEditRoles))
            log.info("user ${superuserService.getCurrentUser()} save access is: $access")
            response.status = access ? HttpStatus.OK.value() :  HttpStatus.FORBIDDEN.value()
        }else {
            access = superuserService.isAuthorized(propertyService.getList(canViewRoles))
            log.info("user ${superuserService.getCurrentUser()} view access is: $access")
            response.status = access ? HttpStatus.OK.value() :  HttpStatus.FORBIDDEN.value()

        }
        return access
    }

    boolean after() {
        log.info ("execution time of action $params.action was ${Duration.between(start,Instant.now()).toMillis()} ms")
        true
    }

    void afterView() {
        // no-op
    }
}
