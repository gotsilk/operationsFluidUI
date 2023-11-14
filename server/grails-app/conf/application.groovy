import grails.plugin.springsecurity.SecurityConfigType
import org.springframework.web.context.request.RequestContextHolder

// Added by the Spring Security Core plugin:
String extCfg = System.properties["${appName}.configdir"] ?: System.properties['su.configdir'] ?: "${userHome}/conf"

environments {
    grails.config.locations = [
            "file:${extCfg}/${appName}-config.groovy",
            "file:${extCfg}/${appName}-config-local.groovy",
            "file:${extCfg}/${appName}-config.properties",
            "file:${extCfg}/${appName}-config-local.properties",
    ]
    grails.plugin.springsecurity.successHandler.alwaysUseDefault = true
    grails.plugin.springsecurity.successHandler.defaultTargetUrl = '/'

    grails.plugin.springsecurity.rejectIfNoRule = true

    //redirects login page requests to HTTPS
//    grails.plugin.springsecurity.auth.forceHttps = true
    grails.plugin.springsecurity.securityConfigType = SecurityConfigType.InterceptUrlMap


    grails.plugin.springsecurity.useSecurityEventListener = true
    grails.plugin.springsecurity.onAuthenticationSuccessEvent = { e, appCtx ->
        RequestContextHolder.currentRequestAttributes().getSession().setAttribute('XSRF-TOKEN', UUID.randomUUID().toString())
    }

    grails.plugin.springsecurity.interceptUrlMap = [
            [pattern: '/public/saveTableData', access: ['IS_AUTHENTICATED_ANONYMOUSLY']],
            [pattern: '/importDataRow/**',  access: ['IS_AUTHENTICATED_ANONYMOUSLY']],
            [pattern: '/console/**',    access: ['IS_AUTHENTICATED_ANONYMOUSLY']],
            [pattern: '/static/**',     access: ['IS_AUTHENTICATED_ANONYMOUSLY']],
            [pattern: '/login/**',      access: ['IS_AUTHENTICATED_ANONYMOUSLY']],
            [pattern: '/get/**',        access: ['IS_AUTHENTICATED_ANONYMOUSLY']],
            [pattern: '/api/**',        access: ['IS_AUTHENTICATED_FULLY']],
            [pattern: '/**',            access: ['IS_AUTHENTICATED_FULLY']]
    ]
}
