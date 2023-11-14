package com.kylesilk.operations.database

import com.kylesilk.database.DomainMappingCmd
import com.kylesilk.operations.common.ColValueChange
import com.kylesilk.operations.common.SaveRowError
import com.kylesilk.operations.common.ServerSideErrorRS
import grails.compiler.GrailsCompileStatic
import grails.core.GrailsApplication
import groovy.transform.CompileDynamic
import org.grails.core.artefact.DomainClassArtefactHandler
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.mapping.model.PersistentEntity
import org.grails.orm.hibernate.cfg.HibernateMappingContext
import org.springframework.validation.FieldError
import org.springframework.validation.ObjectError

@GrailsCompileStatic
class DomainHelperService {
    GrailsApplication grailsApplication
    HibernateMappingContext grailsDomainClassMappingContext

    static skipFields = ['dateCreated', 'lastUpdated']

    static Map<String,String> specialColTableMapping = [
            parentMiscProduct : 'miscProduct'
    ]

    @CompileDynamic
    DomainMappingCmd mapFieldsToDomain(def fields, GormEntity domainObj, boolean skipId = true, String datasource = null){
        DomainMappingCmd ret = new DomainMappingCmd()
        for (def it : fields){
            final Object currentValue = domainObj[it.key as String]
            try {
                if (skipId && it.key == "id" || (String)it.key in skipFields) {
                    continue
                }

                if (domainObj.hasProperty(it.key as String)) {
                    log.info("setting table: ->${domainObj.class.simpleName}<-, col: ->$it.key<-, with value: ->$it.value<-")//
                        //check if its a relation
                    if (DomainClassArtefactHandler.isDomainClass(domainObj.class.getDeclaredField(it.key as String).type)) {
                        domainObj =  setFkOnTable(it.key as String, it.value as Object, datasource,domainObj)
                    } else {
                        domainObj[it.key as String] = it?.value?.asType(domainObj.class.getDeclaredField(it.key as String).type)
                    }

                    if (domainObj.hasChanged(it.key)){
                        ret.colValueChangeList.add(new ColValueChange(colName: it.key,newValue: it.value, oldValue: currentValue))
                    }
                }
            }catch(Exception e){
                log.error("error mapping out $it.key with val: $it.value", e)
                ServerSideErrorRS errorRS = new ServerSideErrorRS()
                errorRS.colName = it.key
                errorRS.attemptedColVal = it.value.toString()
                errorRS.errorMsg = e.getMessage()
                ret.errorRSList.add(errorRS)
            }
        }
        ret.entity = domainObj
        return ret
    }

    List<SaveRowError> formatValidationErrors(List<ObjectError> errorList){
        List<SaveRowError> errors = []
        for (ObjectError it : errorList){
            SaveRowError saveRowError
            if (it instanceof FieldError){
                saveRowError = new SaveRowError(it as FieldError)
                errors.push(saveRowError)
            }

        }
        return errors
    }

    Class getDomainByTableName(String tableName){
        if (specialColTableMapping.get(tableName) != null){
            tableName = specialColTableMapping.get(tableName)
        }
        Class domainArtefact = grailsApplication.getArtefacts("Domain").find {
            it.shortName.toLowerCase() == tableName.toLowerCase()
        }.clazz

        log.info("returning domain class $domainArtefact.simpleName")
        return domainArtefact
    }

    protected Class<?> getTableIdType(String tableName){
        if (specialColTableMapping.get(tableName) != null){
            tableName = specialColTableMapping.get(tableName)
        }
        return getHibernateEntityDomainByName(tableName).identity.type
    }

    protected PersistentEntity getHibernateEntityDomainByName(String name){
        log.info("looking for domain named: $name")
        PersistentEntity found = grailsDomainClassMappingContext.persistentEntities.find{
            it.decapitalizedName.toLowerCase() == name.toLowerCase()
        }
        log.info("returning domain: ${found.decapitalizedName}")
        return found
    }

    @CompileDynamic
    GormEntity setFkOnTable(String fkTableName, Object value, String dataSource, GormEntity domainObj){
        Class fkDomainClass = getDomainByTableName(fkTableName)
        if (fkDomainClass) {
            if (value != null && value != "") { // record could come in as 0 maybe
                GormEntity fkEntity = fkDomainClass[dataSource].get(value.asType(getTableIdType(fkTableName as String)))
                domainObj[fkTableName] = fkEntity
            } else {
                domainObj[fkTableName] = null
            }
        }
        return domainObj
    }

}
