package com.kylesilk.operations.utils

import grails.converters.JSON
import groovy.transform.CompileStatic
import operations.category2.ConnectingTableTest1
import org.grails.web.converters.exceptions.ConverterException
import org.grails.web.converters.marshaller.ObjectMarshaller
import org.grails.web.json.JSONWriter
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@CompileStatic
class StarProfileMarshaller implements ObjectMarshaller<JSON> {

    static List<String> excludes = ['fareDops']

    private static final Logger log = LoggerFactory.getLogger(StarProfileMarshaller.class)

    @Override
    boolean supports(Object object) {
        return object instanceof ConnectingTableTest1
    }

    @Override
    void marshalObject(Object o, JSON json) throws ConverterException {
        ConnectingTableTest1 starProfile = (ConnectingTableTest1)o
        JSONWriter writer = json.getWriter();
        writer.object();
        Map<?, ?>  props = starProfile.properties
        props.each {
            log.info(it.getKey().toString() + it.getValue().toString())
            if ( !(it.getKey().toString() in excludes) ){
                log.info("writing ${it.getKey()}, bc its not in excludes")
                writer.key(it.getKey().toString())
                json.convertAnother(it.getValue().toString())
            }
            if ( it.getKey().toString() in excludes ){
                if (it.getKey() == "fareDops"){
                    log.info(it.getValue().toString())
                }
            }

        }
        writer.endObject();
    }
}
