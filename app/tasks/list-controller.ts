///<reference path='../references.ts' />

class TasksListController extends BaseListController {

    public flexibleLayoutOptions: any = {
        ratios: [.1, .3, .6],
        direction: 1 //FlexibleLayout.DIRECTION_Y
    };

    init(){
        "use strict";
        this.context.pageTitle = "Task Search";
        super.init();
    }

}

angular.module('app.tasks')
    .controller('TasksListController', ['$injector', 'TasksResourceService', 'MetadataService', TasksListController]);