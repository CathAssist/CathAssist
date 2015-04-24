angular.module('cathassist.services', [])

.service('localDB', function ($http, $q) {
    var service = {};
    //init database
    service.initDB = function () {
        console.log('init database...');
        try {
            if (window.sqlitePlugin) {
                service.db = window.sqlitePlugin.openDatabase({ name: this.dbName + ".db", location: 1 });                console.log("using sqlite db");
            }            else {
                service.db = window.openDatabase(this.dbName, this.dbVersion, "database for cathassist.org", 200000);                console.log("using web sql");
            }
        }        catch (e) {
            alert("目前『天主教小助手』无法支持你的浏览器，欢迎你下载我们的app使用。");            window.open("http://www.cathassist.org/app.html");            return;
        }        service.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');            tx.executeSql('CREATE TABLE IF NOT EXISTS vaticanacn (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS faithlife (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id integer unique,title,pic,content,cate,time)');
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