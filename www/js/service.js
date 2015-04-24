angular.module('cathassist.services', [])

.service('localDB', function ($http, $q) {
    var service = {};
    //init database
    service.initDB = function () {
        console.log('init database...');
        try {
            if (window.sqlitePlugin) {
                service.db = window.sqlitePlugin.openDatabase({ name: this.dbName + ".db", location: 1 });
            }
                service.db = window.openDatabase(this.dbName, this.dbVersion, "database for cathassist.org", 200000);
            }
        }
            alert("目前『天主教小助手』无法支持你的浏览器，欢迎你下载我们的app使用。");
        }
            tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');
        });
    };
    //get news list
    service.getNews = function ($channel, $from) {
        console.log('service get news...');
        var deferred = $q.defer();
        $http.jsonp('http://www.cathassist.org/' + $channel + '/getarticle.php?type=jsonp&mode=list&from=' + $id + '&&callback=JSON_CALLBACK')
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject('error.');
            });
        return deferred.promise;
    };


    if (service.db == null || service.db == undefined) {
        service.initDB();
    }
    return service;
});