package com.kylesilk.operations.common

class SaveRowRS {
    List<SaveRowError> errors
    Object domainObj
    String backendMsg
    boolean success = false
    Object id
    List<ServerSideErrorRS> backEndErrors = []
}
