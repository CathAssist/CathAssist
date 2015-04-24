angular.module('cathassist.services', [])

.service('localDB', function ($http, $q) {
    var service = {};
    service.server = 'http://www.cathassist.org/';
    //init database
    service.initDB = function () {
        console.log('init database...');
        try {
            if (window.sqlitePlugin) {
                service.db = window.sqlitePlugin.openDatabase({ name: this.dbName + ".db", location: 1 });
                console.log("using sqlite db");
            }
            else {
                service.db = window.openDatabase(this.dbName, this.dbVersion, "database for cathassist.org", 200000);
                console.log("using web sql");
            }
        }
        catch (e) {
            alert("目前『天主教小助手』无法支持你的浏览器，欢迎你下载我们的app使用。");
            window.open("http://www.cathassist.org/app.html");
            return;
        }
        service.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS vaticanacn (id integer unique,title,pic,content,cate,time)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS faithlife (id integer unique,title,pic,content,cate,time)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id integer unique,title,pic,content,cate,time)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS newslist (id integer primary key asc,name,content)');
        });
    };

    service.clearAll = function () {
        if (!service.db)
            return null;
        console.log('Clear all db...');
        service.db.transaction(function (tx) {
            tx.executeSql('drop table stuff;');
            tx.executeSql('drop table vaticanacn;');
            tx.executeSql('drop table faithlife;');
            tx.executeSql('drop table articles;');
            tx.executeSql('drop table newslist;');
            tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS vaticanacn (id integer unique,title,pic,content,cate,time)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS faithlife (id integer unique,title,pic,content,cate,time)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id integer unique,title,pic,content,cate,time)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS newslist (id integer primary key asc,name,content)');
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
        {
            service.db.transaction(function (tx) {
                tx.executeSql('select name,content from newslist where name=?', [$channel], function (tx, r) {
                    if (r.rows.length > 0) {
                        var news = r.rows.item(0);
                        deferred.resolve(JSON.parse(news.content));
                    }
                    else {
                        console.log('can not load news from local...');
                        $http.jsonp(service.server + $channel + '/getarticle.php?type=jsonp&mode=list&from=-1&&callback=JSON_CALLBACK')
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

        $http.jsonp(service.server + $channel + '/getarticle.php?type=jsonp&mode=list&from=' + $from + '&&callback=JSON_CALLBACK')
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
        console.log('service set news...');
        service.db.transaction(function (tx) {
            $json = JSON.stringify($news);

            tx.executeSql('delete from newslist where name=?', [$channel]);
            tx.executeSql('insert into newslist(name,content) values(?,?)', [$channel,$json]);
        });
    };

    //get article
    service.getArticle = function ($channel, $id) {
        console.log('service get article...');
        var deferred = $q.defer();

        service.db.transaction(function(tx){
            tx.executeSql('select * from '+$channel+' where id=?', [$id], function(tx,r){
                if(r.rows.length>0 && (r.rows.item(0).content!="" && r.rows.item(0).content!=null))
                {
                    console.log("locad article from database...");
                    deferred.resolve(r.rows.item(0));
                }
                else
                {
                    console.log("locad article from remote...");
                    $http.jsonp(service.server + $channel + '/getarticle.php?type=jsonp&mode=item&id=' + $id + '&&callback=JSON_CALLBACK')
                        .success(function (data) {
                            service.setArticle($channel,data);
                            deferred.resolve(data);
                        })
                        .error(function () {
                            deferred.reject('error.');
                        });   
                }
            },function(tx,r){refresh = true;});
        });

        return deferred.promise;
    };
    //set article
    service.setArticle = function($channel, $article) {
        console.log('service set article...');
        service.db.transaction(function(tx){
            tx.executeSql('insert into '+$channel+'(id,title,pic,content,cate,time) values(?,?,?,?,?,?)',
                [$article.id,$article.title,$article.pic,$article.content,$article.cate,$article.time]);
        });
    };

    //get pray book
    service.getPraybook = function($refresh){
        console.log('service pray book...');
        var deferred = $q.defer();

        if($refresh == "" || $refresh == 'undefined')
        {
            service.db.transaction(function (tx) {
                tx.executeSql('select name,content from newslist where name=?', ['praybook'], function (tx, r) {
                    if (r.rows.length > 0) {
                        var news = r.rows.item(0);
                        deferred.resolve(JSON.parse(news.content));
                    }
                    else {
                        console.log('can not load praybook from local...');
                        $http.jsonp(service.server+'pray/getprays.php?type=jsonp&callback=JSON_CALLBACK')
                            .success(function (data) {
                                service.setNews('praybook', data);
                                deferred.resolve(data);
                            })
                            .error(function () {
                                deferred.reject('error.');
                            });
                    }
                }, function (tx, r) {});
            });
        }
        else
        {
            console.log('load pray book from remote...');
            $http.jsonp(service.server+'pray/getprays.php?type=jsonp&callback=JSON_CALLBACK')
                .success(function (data) {
                    service.setNews('praybook', data);
                    deferred.resolve(data);
                })
                .error(function () {
                    deferred.reject('error.');
                });   
        }
        return deferred.promise;
    };


    if (service.db == null || service.db == undefined) {
        service.initDB();
    }
    return service;
});
