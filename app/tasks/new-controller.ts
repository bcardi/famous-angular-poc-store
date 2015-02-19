///<reference path='../references.ts' />

class TasksNewController extends BaseNewController {

    constructor($injector:any, resourceService: IResourceService, metadataService: IMetadataService) {
        "use strict";
        /*
         Initialize required properties before calling super.constructor
         */
        this.context = this.context || <IControllerContext>{};
        this.context.pageTitle = "New Task";
        super($injector, resourceService, metadataService);
    }
}

angular.module('app.tasks')
    .controller('TasksNewController', ['$injector', 'TasksResourceService', 'MetadataService', TasksNewController]);