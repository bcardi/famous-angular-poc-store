///<reference path='config.ts' />
///<reference path='routes.ts' />
///<reference path='index.ts' />
///<reference path='references.ts' />

angular.module('app.main', [
    'famous.angular',
    'ui.router',
    'cheese',
    'app.config',
    'app.routes',
    'app.tasks'
]);

class FlexibleLayoutController {

    public test: string = "Hello";
    public flexibleLayoutOptions: any = {
        ratios: [.1, .3, .6],
        direction: 1 //FlexibleLayout.DIRECTION_Y
    }

    public modifierOptions: any = {
    }

    constructor(){
    }
}

angular.module('app.main')
    .controller('app.flexibleLayoutController', [FlexibleLayoutController]);