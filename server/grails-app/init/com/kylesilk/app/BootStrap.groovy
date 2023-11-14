package com.kylesilk.app

import com.kylesilk.operations.controllers.api.ApiController
import com.kylesilk.operations.database.DomainService

class BootStrap {
    DomainService domainService


    def init = { servletContext ->
        ApiController.DATA_SOURCES = domainService.getDataSources()
    }
    def destroy = {
    }
}
