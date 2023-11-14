package operations.category2

import com.kylesilk.utils.WidgetConstants


class ConnectingTableTest2 {

    static hasOne = [connectingTable1: ConnectingTableTest1];


    static mapping = {
        datasource 'ALL'
        id column: 'dop_id', generator:'sequence', params:[sequence:'s_fare_dop'];
        version false;
        connectingTable1 column: 'connecting_1'
    }

    static constraints = {
        connectingTable1(nullable: false, widget: WidgetConstants.AUTO_DROP_DOWN);

    }
}
