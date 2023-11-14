package operations.category1

import com.kylesilk.database.FkEnabledI
import com.kylesilk.operations.common.FkListRS


class TestDomain2 implements FkEnabledI{

    BigInteger col1
    String col2
    BigInteger col3

    static mapping = {
        datasource 'ALL'
        id column: 'test_domain_2_id' ,generator:'sequence',params:[sequence:'s_test_domain_2_id']
        version false
    }

    static constraints = {
        col1(nullable: false)
        col2(nullable: false)
    }

    @Override
    FkListRS toDisplay() {
        return new FkListRS(id: this.ident(), display: "ID: ${this.ident()}, name: ${this.col3}")
    }
}
