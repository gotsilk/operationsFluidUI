package operations.category1

import com.kylesilk.utils.WidgetConstants


class TestDomain1 {

    Date time = new Date()
    String col1
    TestDomain2 testDomain2 //translates to test_domain_2_[id]
    String col3
    String col4
    String col5



    static mapping = {
        datasource 'ALL'
        id column: 'test_domain_2_id' ,generator:'sequence',params:[sequence:'s_test_domain_2']
        version false
    }


    static constraints = {
        time(nullable:  true,  widget: WidgetConstants.DATE_READONLY)
        String(maxSize: 1000,nullable: true)
        testDomain2(nullable: true, widget: WidgetConstants.AUTO_DROP_DOWN)
        col3(nullable: true,maxSize: 1000, widget: WidgetConstants.TEXT_AREA)
        col4(maxSize: 1000,nullable: true)
        col5(maxSize: 1000,nullable: true, widget: WidgetConstants.URL)

    }
}
