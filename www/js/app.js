// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cathassist', ['ionic', 'cathassist.controllers', 'cathassist.services', 'cathassist.filters'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })
    
    .state('app.news', {
        url: "/news/:arg",
        views: {
            'menuContent': {
                templateUrl: "templates/news.html",
                controller: 'NewsCtrl'
            },
            'mediaBar': {
                templateUrl: "templates/mediabar.html"
            }
        }
    })

    .state('app.article', {
        url: "/article/:arg",
        views: {
            'menuContent': {
                templateUrl: "templates/article.html",
                controller: 'ArticleCtrl'
            },
            'mediaBar': {
                templateUrl: "templates/mediabar.html"
            }
        }
    })

    .state('app.praybook', {
        url: "/praybook",
        views: {
            'menuContent': {
                templateUrl: "templates/praybook.html",
                controller: 'PraybookCtrl'
            },
            'mediaBar': {
                templateUrl: "templates/mediabar.html"
            }
        }
    })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/news/vaticanacn,-1');
});
