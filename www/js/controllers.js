angular.module('cathassist.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    // Form data for the login modal
})

.controller('PlaylistCtrl', function ($scope, $stateParams) {
})

.controller('NewsCtrl', function ($scope, $http, $stateParams, localDB) {
    console.log($stateParams.arg);
    $args = $stateParams.arg.split(',');
    if ($args < 1)
        return;
    $channel = $args[0];
    $id = '-1';
    if ($args > 1) {
        $id = $args[1];
    }

    $scope.news = {};
    localDB.getNews($channel, $id)
        .then(function (data) {
            data.forEach(function (item) {
                $scope.news[item.id] = item;
            });
        });
    $scope.channel = $channel;
    $scope.title = localDB.getChannelName($channel);

    $scope.refresh = function () {
        localDB.getNews($channel, $id)
            .then(function (data) {
                data.forEach(function (item) {
                    $scope.news[item.id] = item;
                });
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {
        if (Object.keys($scope.news).length < 1)
        {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
        }

        $from = Object.keys($scope.news)[0];
        console.log("from:"+$from);
        localDB.getNews($channel, $from)
            .then(function (data) {
                data.forEach(function (item) {
                    $scope.news[item.id] = item;
                });
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    }
})

.controller('ArticleCtrl', function ($scope, $http, $stateParams, localDB) {
    console.log($stateParams.arg);
    $args = $stateParams.arg.split(',');
    if ($args < 2)
        return;
    $channel = $args[0];
    $id = $args[1];

    localDB.getArticle($channel, $id)
        .then(function (data) {
            $scope.article = data;
        });
    $scope.channel = $channel;
    $scope.title = localDB.getChannelName($channel);
});