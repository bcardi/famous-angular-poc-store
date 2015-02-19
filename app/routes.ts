///<reference path='references.ts' />

angular.module('app.routes', [])
    .config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise("/flexible-layout");
        $stateProvider
            .state("flexible-layout", {
                url: "/flexible-layout",
                templateUrl: "app/views/flexible-layout.html",
                controller: "app.flexibleLayoutController as vm"
            })
            .state("tasks-list", {
                url: "/tasks",
                templateUrl: "app/tasks/list.html",
                controller: "TasksListController as vm"
            })
        ;
    });