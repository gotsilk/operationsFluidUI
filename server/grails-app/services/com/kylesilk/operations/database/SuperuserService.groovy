package com.kylesilk.operations.database

import grails.plugin.springsecurity.SpringSecurityService
import grails.plugin.springsecurity.SpringSecurityUtils
import groovy.transform.CompileStatic
import org.springframework.security.core.GrantedAuthority

@CompileStatic
class SuperuserService {

    SpringSecurityService springSecurityService

    boolean isAuthorized(List<String> allowedRoles){

        log.info("authorizing user: ${getCurrentUser()} on roles: $allowedRoles, UserRoles: ${userRoles()}")
        if (allowedRoles && !allowedRoles.isEmpty()) {
            return isAuthorized(allowedRoles.join(","))
        }
        log.error("allowed roles is not defined!")
        return false
    }

    boolean isAuthorized(String allowedRoles){
        if (allowedRoles) {
            return SpringSecurityUtils.ifAnyGranted(allowedRoles)
        }
        log.error("allowed roles is not defined!")
        return false
    }

    String getCurrentUser(){
        return springSecurityService.principal['username'] as String
    }

    List<String> userRoles (){
        List<String> roles = springSecurityService.getAuthentication().getAuthorities().collect{ GrantedAuthority it -> it.getAuthority()}
        return roles
    }
}
