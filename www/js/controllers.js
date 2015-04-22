angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    // Form data for the login modal
})

.controller('PlaylistCtrl', function ($scope, $stateParams) {
})

.controller('NewsCtrl', function ($scope, $http, $stateParams) {
    console.log($stateParams.arg);
    $args = $stateParams.arg.split(',');
    if ($args < 1)
        return;
    $channel = $args[0];
    $id = '-1';
    if ($args > 1) {
        $id = $args[1];
    }

    $http.jsonp('http://www.cathassist.org/' + $channel + '/getarticle.php?type=jsonp&mode=list&from=' + $id + '&&callback=JSON_CALLBACK').success(function (data) {
        $scope.news = data;
    });
    $scope.title = '普世教会';
    $scope.channel = $channel;
})

.controller('ArticleCtrl', function ($scope, $http, $stateParams) {
    console.log($stateParams.arg);
    $args = $stateParams.arg.split(',');
    if ($args < 2)
        return;
    $channel = $args[0];
    $id = $args[1];

    console.log('http://www.cathassist.org/' + $channel + '/getarticle.php?type=jsonp&mode=item&id=' + $id + '&&callback=JSON_CALLBACK');
    $http.jsonp('http://www.cathassist.org/' + $channel + '/getarticle.php?type=jsonp&mode=item&id='+$id+'&&callback=JSON_CALLBACK').success(function (data) {
        $scope.article = data;
    });
    $scope.title = '普世教会';
    $scope.channel = $channel;
});