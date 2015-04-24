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

    //convert hash to array
    $scope.hash2Array = function (hash) {
        var arr = new Array();
        for (var id in hash) {
            arr.push(hash[id]);
        }
        return arr;
    };

    //refresh current news
    $scope.refresh = function () {
        localDB.getNews($channel, -2)
            .then(function (data) {
                data.forEach(function (item) {
                    $scope.news[item.id] = item;
                });
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    //load more news
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

.controller('ArticleCtrl', function ($scope, $http, $stateParams,$ionicLoading, localDB) {
    console.log($stateParams.arg);
    $args = $stateParams.arg.split(',');
    if ($args < 2)
        return;
    $channel = $args[0];
    $id = $args[1];

    $ionicLoading.show({
        template: 'loading'
    });
    localDB.getArticle($channel, $id)
        .then(function (data) {
            $scope.article = data;
            console.log(data);
            $ionicLoading.hide();
        });
    $scope.channel = $channel;
    $scope.title = localDB.getChannelName($channel);

    //refresh current news
    $scope.refresh = function () {
        localDB.getArticle($channel, $id)
            .then(function (data) {
                $scope.article = data;
                $scope.$broadcast('scroll.refreshComplete');
            });
    };
})

.controller('PraybookCtrl', function ($scope, $http,$ionicLoading, localDB){
    console.log('pray book controller');

    $ionicLoading.show({
        template: 'loading'
    });
    localDB.getPraybook()
        .then(function (data) {
            $scope.prays = data;
            console.log(data);
            $ionicLoading.hide();
        });
    $scope.title = "彼此代祷";

    //refresh current news
    $scope.refresh = function () {
        localDB.getPraybook(1)
            .then(function (data) {
                $scope.prays = data;
                $scope.$broadcast('scroll.refreshComplete');
            });
    };
});

