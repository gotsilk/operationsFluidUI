package com.kylesilk.operations.controllers.api

import com.kylesilk.operations.property.PropertyService
import com.kylesilk.database.DomainStructureRQ
import com.kylesilk.database.DomainStructureRS
import com.kylesilk.database.GetUserAuths
import com.kylesilk.operations.common.GetTableDataRQ
import com.kylesilk.operations.common.SaveTableDataRQ
import com.kylesilk.operations.common.SaveUserTableDataRS
import com.kylesilk.operations.common.StoredTableDataRS
import com.kylesilk.operations.common.UserAuthRQ
import com.kylesilk.operations.database.DomainService
import com.kylesilk.operations.database.OperationsService
import com.kylesilk.operations.database.SuperuserService

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured

@Secured(['permitAll'])
class ApiController {

    DomainService domainService
    SuperuserService superuserService
    PropertyService propertyService
    static List<Map<String,String>>  DATA_SOURCES
//    todo make this
//    XmlHttpService xmlHttpService
    OperationsService operationsService

    static String superUserRoles = 'superUser.roles'

    //final static Map<String,byte[]> USER_SAVED_TABLE_DATA = [:]
    final static Map<String,Object> USER_SAVED_TABLE_DATA = [:]

    def getDomainObjectStructure(DomainStructureRQ rq){
        DomainStructureRS res = domainService.getDomainStructure(rq)
        render(res as JSON)
    }

    def getAllDataSources(){
        render(DATA_SOURCES as JSON)
    }

    def getUserCurrentUserDetails(){
        String username = superuserService.getCurrentUser()
        render([userName:username] as JSON);
    }

    def getCurrentAuths(GetUserAuths rq){
        String propName = rq.mode == 'super' ? superUserRoles : "${rq.database}.${rq.mode == 'edit'? 'editing' : 'viewing'}.roles"
        boolean res = superuserService.isAuthorized(propertyService.getList(propName))
        render res
    }

    def getSubDomain(){
        String url = propertyService.getString('subDomain.url')
        render url
    }

    def saveTableData(SaveTableDataRQ rq){
        SaveUserTableDataRS rs = new SaveUserTableDataRS()
        try {
            log.info("setting for table: ${rq.tableKey} for user: ${rq.userName}, data stringified: ${rq.data}")
            String key = formatKey(rq.userName, rq.tableKey)
            USER_SAVED_TABLE_DATA.put(key, rq.data)
            rs.success = true
        }catch(Exception e){
            rs.success = false;
            rs.msg = e.getMessage()
            log.error(e)
        }
        render(rs as JSON)
    }
//    String url, Object sendPayload, XmlHttpJava.RequestType requestType,
//    ResponseType responseType, String packageName, Map headers, Map responseHeaders, int timeout, Class clazz
    def transferTableData(SaveTableDataRQ rq){
        boolean success = false;
        try {
            Map map = [:]
            map.userName = superuserService.getCurrentUser()
            map.data = rq.data //encryptionService.encrypt(rq.data)
            map.tableKey = rq.tableKey
            String url = propertyService.getString("prod.app.url") + 'public/saveTableData'
//            XmlHttpResponse res = xmlHttpService.sendAndReceiveNew(url, map, XmlHttpJava.RequestType.POST,
//                    XmlHttpJava.ResponseType.JSON_POJO, 'com.kylesilk.operations.common', null, null, 10000, SaveUserTableDataRS.class)
            success = true
        }catch(Exception e){
            log.error(e.getMessage())
        }
        render([status:success] as JSON)
    }

    def transferTableDataLocally(SaveTableDataRQ rq){
        boolean success = false;
        try {
            String userName = superuserService.getCurrentUser()
            String key = formatKey(userName,rq.tableKey)
            log.info("saving data to in memory for user: ${rq.userName}, data: ${rq.data}")
            USER_SAVED_TABLE_DATA.put(key, rq.data) //encryptionService.encrypt(rq.data))
            success = true
        }catch(Exception e){
            log.error(e.getMessage())
        }
        render([status:success] as JSON)
    }

    def getTableData(GetTableDataRQ rq){
        StoredTableDataRS storedTableDataRS = new StoredTableDataRS()
        try{
            String userName = superuserService.getCurrentUser()
            String key = formatKey(userName,rq.tableKey)
            storedTableDataRS.result = USER_SAVED_TABLE_DATA.get(key)
            storedTableDataRS.success = true
        }catch(Exception e){
            log.error(e)
            storedTableDataRS.success = false
        }
        render storedTableDataRS as JSON
    }

    String formatKey(String userName, String key){
        return "$userName:$key"
    }

    def getClientSideProps(){
        Object jsonProps = operationsService.getClientSideProps()
        render(jsonProps as JSON)
    }

    def checkAuthentication(UserAuthRQ rq){
        String propName = "${sanitize(rq.tableType)}.viewing.roles"
        boolean isAuth = superuserService.isAuthorized(propertyService.getList(propName))
        render([status: isAuth] as JSON)
    }

    private static String sanitize(String input){
        switch (input.toLowerCase()){
            case 'fareglobal':
                return 'fare'
            default: return input
        }
    }
}
