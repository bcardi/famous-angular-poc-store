///<reference path='../references.ts' />
class TasksResourceService extends ResourceService implements IResourceService {
}

angular.module('app.tasks')
    .factory('TasksResourceService', ['$injector', '$resource', ($injector, $resource) => new TasksResourceService($injector, $resource)]);