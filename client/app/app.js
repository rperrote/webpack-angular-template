import angular      from 'angular';
import uiRouter     from 'angular-ui-router';
import ngRedux      from 'ng-redux';
import devToolsEnhancer from 'remote-redux-devtools';

import AppComponent from './app.component';

import HomeComponent        from './containers/home/home';

import { RootReducer } from './reducers';

// import our default styles for the whole application
import 'normalize.css';

import './img/favicon.png';

angular
    .module('app', [
        uiRouter,
        ngRedux,
        'wu.masonry',
        HomeComponent.name
    ])
    .filter("trust", ['$sce', function($sce){
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    }])
    .factory("FilterScope", function() { //Ejemplo scope compartido entre dos o mas controllers
        return { text: ''}
    })
    .factory("BeforeUnload", ['$rootScope', '$window', function($rootScope, $window) { //Ejemplo de evento antes de salir del navegador

        // Events are broadcast outside the Scope Lifecycle
        
        $window.onbeforeunload = function (e) {
            $rootScope.$broadcast('onBeforeUnload');
        };
        
        $window.onunload = function () {
            $rootScope.$broadcast('onUnload');
        };

        return {};
    }])
    .run(["BeforeUnload", function(BeforeUnload) {
        // Must invoke the service at least once
    }])
    .config(($locationProvider, $stateProvider, $urlRouterProvider, $ngReduxProvider) => {
        "ngInject";

        // Define our app routing, we will keep our layout inside the app component
        // The layout route will be abstract and it will hold all of our app views
        $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            template: '<app></app>',
            title: "It Launcher"
        })

        // Dashboard page to contain our goats list page
        .state('app.home', {
            url: '/home',
            template: '<home></home>'
        });

        $urlRouterProvider.otherwise('/home');

        $ngReduxProvider.createStoreWith(RootReducer, devToolsEnhancer());
    })

    .component('app', AppComponent);
