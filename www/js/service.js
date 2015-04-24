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
            tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');            tx.executeSql('CREATE TABLE IF NOT EXISTS vaticanacn (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS faithlife (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS newslist (id integer primary key asc,name,content)');
        });
    };

    service.clearAll = function () {
        if (!service.db)            return null;        console.log('Clear all db...');        service.db.transaction(function (tx) {
            tx.executeSql('drop table stuff;');            tx.executeSql('drop table vaticanacn;');            tx.executeSql('drop table faithlife;');            tx.executeSql('drop table articles;');            tx.executeSql('drop table newslist;');
            tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');            tx.executeSql('CREATE TABLE IF NOT EXISTS vaticanacn (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS faithlife (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id integer unique,title,pic,content,cate,time)');            tx.executeSql('CREATE TABLE IF NOT EXISTS newslist (id integer primary key asc,name,content)');
        });
    };

    //get name of channel
    service.getChannelName = function ($channel) {
        if ($channel == 'vaticanacn') {
            return '普世教会';
        }
        else if ($channel == 'faithlife') {
            return '信仰生活';
        }
        else if ($channel == 'articles') {
            return '主内分享';
        }
        return 'unknown';
    };
    //get news list
    service.getNews = function ($channel, $from) {
        console.log('service get news...');

        var deferred = $q.defer();
        if ($from == -1)
        {            service.db.transaction(function (tx) {                tx.executeSql('select name,content from newslist where name=?', [$channel], function (tx, r) {
                    if (r.rows.length > 0) {
                        var news = r.rows.item(0);
                        console.log(news.content);
                        deferred.resolve(JSON.parse(news.content));
                    }                    else {
                        console.log('can not load news from local...');
                        $http.jsonp('http://www.cathassist.org/' + $channel + '/getarticle.php?type=jsonp&mode=list&from=-1&&callback=JSON_CALLBACK')
                            .success(function (data) {
                                service.setNews($channel, data);
                                deferred.resolve(data);
                            })
                            .error(function () {
                                deferred.reject('error.');
                            });
                    }
                }, function (tx, r) {});
            });
            return deferred.promise;
        }

        $http.jsonp('http://www.cathassist.org/' + $channel + '/getarticle.php?type=jsonp&mode=list&from=' + $from + '&&callback=JSON_CALLBACK')
            .success(function (data) {
                if ($from < -1)
                {
                    service.setNews($channel, data);
                }
                deferred.resolve(data);
            })
            .error(function () {
                deferred.reject('error.');
            });
        return deferred.promise;
    };
    //set news list
    service.setNews = function ($channel, $news) {
        if (!service.db)            return null;        console.log('service set news...');        service.db.transaction(function (tx) {
            $json = JSON.stringify($news);

            tx.executeSql('delete from newslist where name=?', [$channel]);            tx.executeSql('insert into newslist(name,content) values(?,?)', [$channel,$json]);
        });
    };

    //get article
    service.getArticle = function ($channel, $id) {
        console.log('service get article...');
        var deferred = $q.defer();
        $http.jsonp('http://www.cathassist.org/' + $channel + '/getarticle.php?type=jsonp&mode=item&id=' + $id + '&&callback=JSON_CALLBACK')
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