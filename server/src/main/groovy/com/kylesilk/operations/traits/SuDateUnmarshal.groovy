package com.kylesilk.operations.traits

import com.kylesilk.operations.common.BulkEditRQ
import com.kylesilk.operations.common.NameValueSet
import grails.web.api.ServletAttributes
import groovy.transform.CompileStatic
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.time.Instant

trait SuDateUnmarshal implements ServletAttributes {

    private static final Logger log = LoggerFactory.getLogger(SuDateUnmarshal.class);
//    XmlHttpService xmlHttpService


    Object unmarshalRequest(){
        Object parsedReq = request.JSON
        parsedReq['formValue'].each {
            try{
                Date d = Date.from(Instant.parse(it.getAt('value') as String))
                log.info("transformed RAW: ${it.getAt('value')} to date: $d")
                parsedReq['formValue'][it.getAt('key') as String] = d
            }catch(Exception e){
                //eat it...not a date
            }
        }
        return parsedReq
    }


    @CompileStatic
    void marshalRequest(Object obj) {
        String[] accept = request.getHeader("Accept").replaceAll("\\s","").split(',')
        response.contentType  = accept.find{String it ->it.contains('application')} ?: accept.find{String it-> it.contains('text')} ?: request.contentType
        response.setHeader('Cache-Control', 'private: max-age=0, no-cache, no-store');
        try {
            if(response.contentType == "application/xml" || response.contentType == "text/xml")
            {
                response.setContentType("text/xml")
//                response.outputStream << xmlHttpService.xmlObjectToStream(obj.class.package.name, obj)
            }
            else {  // default to JSON
                response.setContentType("application/json")
//                response.outputStream << xmlHttpService.jsonObjectToStream(obj)
            }
        }
        catch(IOException ioException) {
            String ioExceptionString = ioException.toString()
            if ( ioExceptionString.contains('ClientAbortException') || ioExceptionString.contains('Broken pipe') ) {
                log.error "ClientAborted hitting wapi:${request.forwardURI} with object:${obj}: ${ioExceptionString}"
            }
            else {
                throw ioException
            }
        }

    }

    void parseDateForBulk(BulkEditRQ rq){
        rq.colVal.each { NameValueSet it ->
            try{
                Date d = Date.from(Instant.parse(it.colVal as String))
                log.info("transformed RAW: ${it.colVal} to date: $d")
                it.colVal = d
            }catch(Exception e){
                //eat it...not a date
            }
        }
    }
}
