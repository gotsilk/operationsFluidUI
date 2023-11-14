package operations.category3

import com.kylesilk.operations.database.SuperuserService
import com.kylesilk.utils.WidgetConstants

class TestDomain3 {

    SuperuserService superuserService

    Date dateCreated
    Date lastUpdated
    String byWhom

    static mapping = {
        version false
        id column: 'test_domain_3_id', generator:'sequence', params:[sequence:'']
        autowire true
        autoTimestamp true
        datasource 'ALL'
    }

    static constraints = {
        dateCreated(widget: WidgetConstants.DATE_READONLY)
        lastUpdated(widget: WidgetConstants.DATE_READONLY)
    }

    def beforeInsert(){
        if (!this.byWhom){
            this.byWhom = superuserService.getCurrentUser()
        }
        return true;
    }
}
