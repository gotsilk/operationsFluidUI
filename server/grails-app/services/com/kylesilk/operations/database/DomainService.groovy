package com.kylesilk.operations.database

import com.kylesilk.database.DomainColStructure
import com.kylesilk.database.DomainMappingCmd
import com.kylesilk.database.DomainStructureRQ
import com.kylesilk.database.DomainStructureRS
import com.kylesilk.operations.common.BulkEditRQ
import com.kylesilk.operations.common.BulkEditRS
import com.kylesilk.operations.common.ColValueChange
import com.kylesilk.operations.common.KeyVal
import com.kylesilk.operations.common.RunSqlScriptRQ
import com.kylesilk.operations.common.SaveRowRS
import com.kylesilk.operations.common.SuError
import com.kylesilk.operations.common.dynamicTable.DynamicTableDetailsRS
import com.kylesilk.operations.common.dynamicTable.DynamicTableList
import grails.compiler.GrailsCompileStatic
import grails.core.GrailsApplication
import grails.gorm.transactions.Transactional
import grails.gorm.validation.DefaultConstrainedProperty
import groovy.sql.GroovyRowResult
import groovy.sql.Sql
import org.grails.core.artefact.DomainClassArtefactHandler
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.mapping.model.PersistentEntity
import org.springframework.dao.DuplicateKeyException
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy

import java.lang.reflect.Field

@Transactional
class DomainService {

    GrailsApplication grailsApplication
    DomainHelperService domainHelperService
    OperationsService operationsService

    static numberDataTypes = ['biginteger', 'bigdecimal', 'long', 'integer', 'short', 'double']
    static stringDataTypes = ['string', 'character', 'character varying']
    static String[] skips = ['lastUpdated', 'dateCreated']
//    static constraintTypes = ['inList', 'max', 'min', 'nullable', 'widget', 'minSize', 'maxSize']

    static String tables = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';"


    DomainStructureRS getDomainStructure(DomainStructureRQ rq){
        DomainStructureRS rs = new DomainStructureRS()
        List<DomainColStructure> colStructureList = []
        PersistentEntity table = domainHelperService.getHibernateEntityDomainByName(rq.domainName)

        List<String> orderedList = getPropertyDefinedListOrder(table)

        DomainColStructure colStructure = new DomainColStructure()
        colStructure.columnName = table.identity.name
        colStructure.columnType = normalizeColType(table.identity.type.name.split('\\.').last().toLowerCase())
        colStructure.isId = true
        colStructureList.add(colStructure)

        table.persistentProperties.findAll{
            if (it.name !='version') {
                DomainColStructure colStru = new DomainColStructure()
                colStru.columnName = it.name
                colStru.columnType =  normalizeColType(it.type.name.split('\\.').last().toLowerCase())
                colStru.isId = false
                colStructureList.add(colStru)
            }
        }
        populateConstraints(table.javaClass, colStructureList)
        colStructureList = sortList(colStructureList, orderedList)
        rs.cols = colStructureList
        return rs
    }

    void populateConstraints(Class domainObject, List<DomainColStructure> colStructureList){
        for (DomainColStructure col : colStructureList){
            DefaultConstrainedProperty constraints = domainObject.constrainedProperties[col.columnName]?.property
            if (constraints) { //most likely the ID skip
                if (constraints.widget) {
                    col.constraints.put('widget', constraints.widget as String)
                }
                constraints.appliedConstraints.each {
                    col.constraints.put(it.toString().split("Constraint")[0].split("\\[")[1].toLowerCase(), it.getParameter().toString())
                }
            }
        }
    }

    List<Map<String,String>> getDataSources() {
        log.info "populating the data sources"
        List<Map<String,String>> dataSources = []
        Map<String, TransactionAwareDataSourceProxy> beans = grailsApplication.mainContext.getBeansOfType(TransactionAwareDataSourceProxy.class);
        for (def bean : beans) {
            String datasource = bean.getKey()
            if (datasource.toLowerCase() == 'datasource') {
                continue;
            }
            if(!bean.getValue().targetDataSource.targetDataSource.poolProperties.password){
                continue
            }
            Map<String,String> source = [:]

            String name = datasource.replace('dataSource_', '');
            String url = bean.getValue().targetDataSource.targetDataSource.poolProperties.url.split("://").last()
            source.put("name",name)
            source.put("url",url)
            log.info "found datasource named: $name, url: $url"
            dataSources.push(source);
        }
        return dataSources
    }

    @GrailsCompileStatic
    List<GroovyRowResult> runSqlScript(RunSqlScriptRQ rq, boolean skipSlack = false){
        Object dataSource = grailsApplication.mainContext.getBean("dataSource_${rq.dataSource}")
        Sql tablesQuery = new Sql(dataSource as TransactionAwareDataSourceProxy)
        if (!skipSlack) {
            operationsService.logSlack("RAN SCRIPT: $rq.sql")
        }
        try{
            List<GroovyRowResult> rows = tablesQuery.rows(rq.sql)
            return rows
        }catch(Exception e){
            log.error("error executing the raw sql script", e)
            return []
        }

    }

    List<String> getTablesOnDataSource(String dataSourceName){
        TransactionAwareDataSourceProxy dataSource = getDataSourceByName(dataSourceName)
        Sql tablesQuery = new Sql(dataSource)
        List<GroovyRowResult> rows = tablesQuery.rows(tables)
        List<String> tables = []

        rows.each {
            tables.push(it.tablename)
        }
        return tables
    }

    String normalizeColType(String type){
        if (type in numberDataTypes){
            return 'number'
        }
        if (type in stringDataTypes){
            return 'string'
        }
        return type
    }

    List<Object> getTableRows(String domainName,Object id,String dataSource){
        //ids come in as string
        Class domainArtefact = domainHelperService.getDomainByTableName(domainName)
        if (id) {
            log.info("have id, will attempt to transform from string to db type'd")
            id = transformObjToTableIdentType(id as String, domainName)
        }
        try{
            if (domainArtefact) {
                return domainArtefact[dataSource].withCriteria {
                    if (id) {
                        eq("id", id)
                    }
                }
            }
        }catch(Exception e){
            log.error("error retrieving records", e)
            SuError error = new SuError()
            error.headMsg = e.getMessage()
            error.errorMsg = e.getCause().toString()
            return [error]
        }

        return ["TABLE: ${domainName} was not found"]
    }

    SaveRowRS saveTableRowData(def rq){
        SaveRowRS rs = new SaveRowRS()
        try {
            Class domainArtefact = domainHelperService.getDomainByTableName(rq.tableName)
            domainArtefact[rq.dataSource].withNewTransaction {
                GormEntity row
                Object id =  rq.id ? transformObjToTableIdentType(rq.id, rq.tableName) : null

                if (id){
                    row = domainArtefact[rq.dataSource].get(id)
                }else {
                    row = domainArtefact.newInstance() as GormEntity
                }
                DomainMappingCmd cmd = domainHelperService.mapFieldsToDomain(rq.formValue, row, rq.skipId, rq.dataSource)
                row = cmd.entity
                rs.backEndErrors = cmd.errorRSList
                // dont try and save if there are errors on it.
                if (!rs.backEndErrors.isEmpty()){
                    return rs
                }
                ////////////////////////////////////
                if (!row.validate()) {
                    rs.errors = domainHelperService.formatValidationErrors(row.errors.allErrors)
                    return rs
                }

                if (!cmd.colValueChangeList.isEmpty()) {
                    operationsService.logSlack(toSlackLogMsg(rq.tableName, rq.dataSource, cmd.colValueChangeList))
                }
                if (row.validate()) {
                    row[rq.dataSource].save(flush: true)
                    rs.domainObj = row
                    rs.id = row.ident()
                    rs.success = true
                }
            }
        }catch(DuplicateKeyException e){
            log.error("error saving the row", e)
            String backendMsg = "Duplicate Primary Key ERROR, please fix the seq attached to the table"
            rs.backendMsg = backendMsg
        }
        catch(Exception e){
            log.error("error saving the row", e)
            rs.backendMsg = e.getMessage()
        }
        return rs
    }

    BulkEditRS bulkEditTable(BulkEditRQ rq){
        BulkEditRS saveRs = new BulkEditRS()
        Class<GormEntity> table = domainHelperService.getDomainByTableName(rq.tableName)
        table[rq.dataSource].withNewTransaction {trans ->
            List<GormEntity> rows = table[rq.dataSource].getAll(rq.ids)
            if (rows) {
                try {
                    saveRs.success = true
                    for (GormEntity it: rows){
                        KeyVal rowStatus = new KeyVal()
                        rowStatus.key = it.ident()
                        rowStatus.val = false
                        log.info("setting table: $table, col name: $rq.colVal.colName, with value: $rq.colVal.colVal")

                        if (DomainClassArtefactHandler.isDomainClass(table.getDeclaredField(rq.colVal.colName as String).type)) {
                            it = domainHelperService.setFkOnTable(rq.colVal.colName,rq.colVal.colVal,rq.dataSource, it)
                        }else {
                            it[rq.colVal.colName] = rq.colVal.colVal
                        }

                        if (it[rq.dataSource].save([flush: true])){
                            rowStatus.val = true
                        }
                        saveRs.rowStatus.push(rowStatus)
                    }
                } catch (Exception e) {
                    log.error(e.getMessage())
                    saveRs.success = false
                }
            }else {
                log.error("got no rows with provided ids")
                saveRs.success = false
            }
        }

        return saveRs
    }

    Object transformObjToTableIdentType(Object ident, String tableName){
        Object id
        Class idType = domainHelperService.getTableIdType(tableName)
        switch (idType){
            case Long:
                id = Long.parseLong(ident.toString())
                break
            case BigInteger:
                id = new BigInteger(ident.toString())
                break
            default: id = ident.toString()
        }
        log.info("transforming string id to type: ${id.class.simpleName}")
        return id
    }

    @GrailsCompileStatic
    List<String> getPropertyDefinedListOrder(PersistentEntity clazz) {
        Class tableJavaClass = clazz.javaClass
        Field[] fields = tableJavaClass.getDeclaredFields()
        List<String> orderList = []
        fields.each { Field it ->
            orderList.add(it.name)
        }
        return orderList
    }

    @GrailsCompileStatic
    List<DomainColStructure> sortList(List<DomainColStructure> colStructureList, List<String> orderList) {
        List<DomainColStructure> sortedColList = []
        orderList.each {String o ->
            DomainColStructure foundCol = colStructureList.find{DomainColStructure it ->it.columnName == o}
            if (foundCol) {
                sortedColList.add(foundCol)
            }
        }

        return sortedColList
    }

    String toSlackLogMsg(String tableName, String dataSource, List<ColValueChange> changedCols){
        StringBuilder sb = new StringBuilder()
        sb.append("tableName: $tableName\n")
        sb.append("dataSource: $dataSource\n")
        for(ColValueChange nv: changedCols){
            if ((String)nv.colName in skips){
                continue
            }
            sb.append("$nv.colName: old - $nv.oldValue | new - $nv.newValue\n")
        }
        return sb.toString()
    }

    @GrailsCompileStatic
    DynamicTableList listRawRows(String tableName, String ds){
        DynamicTableList res = new DynamicTableList()
        List<String> colHeaders = []
        TransactionAwareDataSourceProxy dataSource = getDataSourceByName(ds)
        Sql tablesQuery = new Sql(dataSource)


        String colNamesSQL = """SELECT * 
                                FROM information_schema.columns 
                                WHERE table_schema = 'public' AND table_name = '${tableName}'"""

        List<GroovyRowResult> colHeadsData = tablesQuery.rows(colNamesSQL)
        if (!colHeadsData.isEmpty()){
            colHeadsData.each{
                colHeaders.add(it.column_name as String)
            }
        }else {
            res.success = false
        }

        String pkSql = buildPkSql(tableName)
        List<GroovyRowResult> pkDataList  = tablesQuery.rows(pkSql)
        if (pkDataList.isEmpty()){
            res.success = false
        }else {
            res.pkName = pkDataList[0].key_column
        }


        try {
            String sql = "SELECT * FROM $tableName"
            List<GroovyRowResult> rows = tablesQuery.rows(sql)
            if (!rows.isEmpty()) {
                res.data = rows
            }
        }catch(Exception e){
            log.error("error getting table rows", e)
        }
        res.colHeaders = colHeaders
        return res
    }

    @GrailsCompileStatic
    DynamicTableDetailsRS getDynamicTableDetail(String tableName, String dataSource, Object id){
        DynamicTableDetailsRS detailsRS = new DynamicTableDetailsRS()
        Map res = [:]
        Object datasource = getDataSourceByName(dataSource)
        Sql tablesQuery = new Sql(datasource as TransactionAwareDataSourceProxy)

        String pkSql = buildPkSql(tableName)
        GroovyRowResult result = tablesQuery.rows(pkSql).first()

        detailsRS.pkName = result.key_column as String
        detailsRS.pkType = normalizeColType(result.data_type as String)


        List<KeyVal> cols = []
        String detailsSql = """SELECT column_name, data_type
                                FROM information_schema.columns
                                WHERE table_name = '${tableName}'
                            """

        List<GroovyRowResult> colResult = tablesQuery.rows(detailsSql)
        colResult.each {
            if (it.column_name != res.pk){
                KeyVal c = new KeyVal()
                c.key = it.column_name
                c.val = normalizeColType(it.data_type as String)
                cols.add(c)
            }
        }
        detailsRS.cols = cols

        String rowDetailSql = """ select * from ${tableName}
                                 where ${detailsRS.pkName} = ${detailsRS.pkType == 'string' ? '\''+ id + '\'' : id} """

        GroovyRowResult detailResult = tablesQuery.firstRow(rowDetailSql)
        detailsRS.data = detailResult

        return detailsRS
    }

    TransactionAwareDataSourceProxy getDataSourceByName(String name){
        return grailsApplication.mainContext.getBean("dataSource_${name}") as TransactionAwareDataSourceProxy
    }

    static String buildPkSql(String tableName){
        return """select 
                            k.table_schema,
                            k.table_name,
                            t.constraint_name,
                            k.ordinal_position as position,
                            k.column_name as key_column,
                            c.data_type
                         from information_schema.table_constraints t
                         inner join information_schema.key_column_usage k on k.constraint_name = t.constraint_name
                            and k.constraint_schema = t.constraint_schema
                            and k.constraint_name = t.constraint_name
                         inner join information_schema.columns c on c.table_schema = k.table_schema
                            and c.table_name = k.table_name 
                            and c.column_name = k.column_name
                         where t.constraint_type = 'PRIMARY KEY'
                            and t.table_name = '${tableName}'
                         order by 
                            k.table_schema, 
                            k.table_name, position;
                        """
    }
}
