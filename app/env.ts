///<reference path='references.ts' />

angular.module('app.config')
    .config(['ApplicationConfigProvider', function(ApplicationConfigProvider) {
        ApplicationConfigProvider.setConfig({
            apiBasePath:        '',
            esBasePath:         'http://localhost:9200/fa/',
            couchDBBasePath:    ''
        });
    }]);