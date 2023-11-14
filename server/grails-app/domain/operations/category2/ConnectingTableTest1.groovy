package operations.category2

import com.kylesilk.database.FkEnabledI
import com.kylesilk.operations.common.FkListRS

class ConnectingTableTest1 implements FkEnabledI {

    Integer ticketTypeId = 1;
    String searchGroup;
    String serviceFeeCurrencyCode;


    static hasMany = [fareDop:ConnectingTableTest2]

    static mapping = {
        datasource 'ALL'
        id column: 'connecting_table_1_id', generator: 'assigned', index: 'ix_connecting_table_1_id';
        version false;
        fareDop column: 'connecting_table_1_id'
    }

    @Override
    String toString() {
        return this.ident();
    }

    @Override
    FkListRS toDisplay(){
        return new FkListRS(id: this.ident(), display: this.ident())
    }

    static constraints = {
        serviceFeeCurrencyCode(nullable: true, matches: /[A-Z]{0,3}/);
        searchGroup(nullable: true, maxSize: 50);        ;
        ticketTypeId(nullable: false, inList: [1, 2, 3]);
    }
}
