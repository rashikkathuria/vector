/*jslint node: true*/
/*global angular*/
/*jslint browser: true*/
/*jslint nomen: true */
/*global $, jQuery, alert, _*/

'use strict';

/* Controllers */


// hack to deal with window/tab out of focus
var hidden,
    visibilityChange;

if (document.hidden !== undefined) { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (document.mozHidden !== undefined) {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
} else if (document.msHidden !== undefined) {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (document.webkitHidden !== undefined) {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

var controllers = angular.module('app.controllers', []);

controllers.controller('IndexCtrl', function ($scope, $routeParams, $log, $rootScope, DashboardService) {
    $log.info("Index controller initialized.");

    DashboardService.initializeProperties();

    $rootScope.contextAvailable = false;

    if ($routeParams.host) {
        $log.info("Host: " + $routeParams.host);
        $rootScope.properties.host = $routeParams.host;
        DashboardService.updateHost();
        $rootScope.contextAvailable = true;
    }

    $scope.updateHost = DashboardService.updateHost;

    $scope.pcpDemo = function () {
        $rootScope.properties.host = 'pcpdemo.test.netflix.net';
        $scope.updateHost();
    };
});

controllers.controller('DashboardCtrl', function ($scope, $rootScope, $log, $route, $routeParams, widgetDefinitions, defaultWidgets, DashboardService) {
    var widgets,
        path = $route.current.$$route.originalPath;

    $log.info("Dashboard controller initialized with " + path + " view.");


    switch (path) {
    case '/default':
        widgets = defaultWidgets;
        break;
    case '/clean':
        widgets = [];
        break;
    case '/java':
        widgets = [];
        break;
    default:
        $log.warn("View not found.");
        widgets = [];
    }

    $scope.dashboardOptions = {
        hideToolbar: true,
        widgetButtons: false,
        hideWidgetName: true,
        hideWidgetOptions: true,
        widgetDefinitions: widgetDefinitions,
        defaultWidgets: widgets
    };

    $scope.updateInterval = DashboardService.updateInterval;

    $scope.updateHost = DashboardService.updateHost;

    $scope.updateWindow = DashboardService.updateWindow;

    DashboardService.initializeProperties();

    if ($routeParams.host) {
        $log.info("Host: " + $routeParams.host);
        $rootScope.properties.host = $routeParams.host;
        DashboardService.updateHost();
    }

    // hack to deal with window/tab out of focus
    document.addEventListener(visibilityChange, function () {
        if (document[hidden]) {
            DashboardService.cancelInterval();
        } else {
            DashboardService.updateInterval();
        }
    }, false);

});