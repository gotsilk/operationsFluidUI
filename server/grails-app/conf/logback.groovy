import grails.util.BuildSettings
import grails.util.Metadata
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.util.logging.Level

String appName = Metadata.current.getApplicationName();
String stdOutPattern = '%d{yyyy/MM/dd HH:mm:ss.SSS} [%-5p] [%c{0}] %m [%X{sessionId}]%n';
String logDir = System.properties["${appName}.logdir"] ?: System.properties["default.logdir"] ?: BuildSettings.TARGET_DIR ?: "${System.getProperty('user.home')}/log";

// See http://logback.qos.ch/manual/groovy.html for details on configuration
appender('STDOUT', ConsoleAppender) {
    encoder(PatternLayoutEncoder) {
        pattern = stdOutPattern
    }
}

appender("FULL_STACKTRACE", RollingFileAppender) {
    file = "${logDir}/${appName}-stacktrace.log"
    append = true
    encoder(PatternLayoutEncoder) {
        pattern = stdOutPattern
    }
    rollingPolicy(TimeBasedRollingPolicy) {
        fileNamePattern = "${logDir}/${appName}-stacktrace-%d{yyyy-MM-dd}.log"
    }
}
appender("MAIN_LOG_FILE", RollingFileAppender) {
    file = "${logDir}/${appName}.log"
    append = true
    encoder(PatternLayoutEncoder) {
        pattern = stdOutPattern
    }
    rollingPolicy(TimeBasedRollingPolicy) {
        fileNamePattern = "${logDir}/${appName}-%d{yyyy-MM-dd}.log"
    }
}

logger("org.grails.core.DefaultGrailsDomainClass", OFF,['STDOUT', 'MAIN_LOG_FILE'])
logger("StackTrace", ERROR, ['FULL_STACKTRACE'], false)
root(INFO, ['STDOUT', 'MAIN_LOG_FILE'])
