package com.kylesilk.operations.controllers

class UrlMappings {

    static mappings = {
//        "/$controller/$action?/$id?(.$format)?"{
//            constraints {
//                // apply constraints here
//            }
//        }


        //PLUGINS
        "/plugins/$plugin/$controller/$action?/$id?" {
            constraints {
                plugin(inList: ['properties'])
                controller(inList: ['config'])
                action(inList: ['view'])
            }
        }


        "/sql"(uri:"/index.html")
        "/access-denied"(uri:"/index.html")
        "/school-importer"(uri:"/index.html")
        "/category1"(uri:"/index.html")
        "/category1/**"(uri:"/index.html")

        "/Category2"(uri:"/index.html")
        "/Category2/**"(uri:"/index.html")

        "/Category3"(uri:"/index.html")
        "/Category3/**"(uri:"/index.html")

        //this is to import data via iframe, need to exclude this from security too
        "/importDataRow"(uri:"/index.html")

        "/dev-test"(uri:"/index.html")
        "/can"(uri:"/index.html")


        "/api/common/$action"(controller: 'Api')
        "/api/superuser/$action"(controller: 'SuperUser')
        "/public/saveTableData"(controller: 'Api', action: 'saveTableData')

        "/api/$controller/$action"{

        }
        "/"(uri:"/index.html")
        "500"(view:'/error')
        "404"(view:'/notFound')

    }
}
