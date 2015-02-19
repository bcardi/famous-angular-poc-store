///<reference path='../references.ts' />

class TasksEditController extends BaseEditController {

    constructor($injector:any, resourceService: IResourceService, metadataService: IMetadataService) {
        "use strict";
        /*
         Initialize required properties before calling super.constructor
         */
        this.context = this.context || <IControllerContext>{};
        this.context.pageTitle = "Edit Task";
        super($injector, resourceService, metadataService);
    }
}

angular.module('app.tasks')
    .controller('TasksEditController', ['$injector', 'TasksResourceService', 'MetadataService', TasksEditController]);