package com.kylesilk.operations.responses.dynamiccontent

class DynamicContentRS {
    Serializable id
    String name;
    String type;
    String valigatorKey;
    List<DynamicContentPlacementRS> placements = []
}
