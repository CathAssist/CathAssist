angular.module('cathassist.services', [])
.service('MediaManager', ['$interval', '$timeout', '$window', function ($interval, $timeout, $window) {
    var player = {};        //export object
    var currentMedia = null;
    var playerTimer;

    var useNative = true;

    player.tracks = [];
    player.currentTrack = null;
    player.duration = 0;
    player.current = 0;
    /*
    status:
        Media.MEDIA_NONE = 0;
        Media.MEDIA_STARTING = 1;
        Media.MEDIA_RUNNING = 2;
        Media.MEDIA_PAUSED = 3;
        Media.MEDIA_STOPPED = 4;
    */


    if (!$window.cordova && !$window.Media) {
        console.log("missing Cordova Media plugin, using html5 audio");
        useNative = false;
        currentMedia = new Audio();
    }

    var startTimer = function () {
        if (angular.isDefined(playerTimer)) {
            console.log("Defined playerTimer...")
            return;
        }

        if (!player.currentTrack) return;

        playerTimer = $interval(function () {
            if (player.currentTrack.duration < 0) {
                if (useNative) {
                    player.currentTrack.duration = currentMedia.getDuration();
                }
                else {
                    player.currentTrack.duration = currentMedia.duration;
                }
                console.log("update duration-" + player.currentTrack.duration);
            }

            if (useNative) {
                currentMedia.getCurrentPosition(
                // success callback
                function (position) {
                    if (position > -1) {
                        player.currentTrack.progress = position;
                        //console.log("update progress-" + player.currentTrack.duration);
                    }
                },
                // error callback
                function (e) {
                    console.log("Error getting pos=" + e);
                });
            }
            else
            {
                player.currentTrack.progress = currentMedia.currentTime;
                //console.log("update progress-" + player.currentTrack.progress);
            }

            if (angular.isFunction(player.currentTrack.onProgress))
                player.currentTrack.onProgress(player.currentTrack.progress, player.currentTrack.duration);

        }, 1000);

    };

    var stopTimer = function () {
        if (angular.isDefined(playerTimer)) {
            $interval.cancel(playerTimer);
            playerTimer = undefined;
        }
    };

    var releaseMedia = function () {
        if (angular.isDefined(currentMedia)) {
            if (useNative)
            {
                currentMedia.release();
                currentMedia = undefined;
            }
            else
            {
                currentMedia.src = "";
            }
            player.currentTrack = undefined;
        }
    };

    var onSuccess = function () {
        player.currentTrack.status = 0;
        stopTimer();
        releaseMedia();

        console.log("MediaManager ended...")

        if (angular.isFunction(this.onSuccess))
            this.onSuccess();
    };

    var onError = function () {
        player.currentTrack.status = 0;
        console.log("Play status:" + this.status);
    };

    var onStatusChange = function (status) {
        player.currentTrack.status = status;
        console.log("Play status:" + player.currentTrack.status);
    };

    var onPlay = function () {
        player.currentTrack.status = 1;
        console.log("Play status:" + player.currentTrack.status);
    }

    var onPlaying = function () {
        player.currentTrack.status = 2;
        console.log("Play status:" + player.currentTrack.status);
    };

    var onPause = function () {
        player.currentTrack.status = 3;
        console.log("Play status:" + player.currentTrack.status);
    };

    var createMedia = function (track) {
        if (!track.url) {
            console.log('ionic-audio: missing track url');
            return undefined;
        }

        return new Media(track.url,
            angular.bind(track, onSuccess),
            angular.bind(track, onError),
            angular.bind(track, onStatusChange));
    };

    var playMedia = function (track) {
        if(!track.url)
        {
            console.log('missing track url...');
            return;
        }
        currentMedia.src = track.url;
        currentMedia.currentSrc = track.url;
        currentMedia.addEventListener('ended', onSuccess);
        currentMedia.addEventListener('error', onError);
        currentMedia.addEventListener('play', onPlay);
        currentMedia.addEventListener('playing', onPlaying);
        currentMedia.addEventListener('pause', onPause);

        currentMedia.play();
        track.status = 1;
    }

    var destroy = function () {
        stopTimer();
        releaseMedia();
    };

    player.stop = function () {
        console.log('stopping track ' + player.currentTrack.title);
        if (useNative)
        {
            currentMedia.stop();    // will call onSuccess...
        }
        else
        {
            currentMedia.pause();
            currentMedia.currentSrc = "";
        }

        player.currentTrack = undefined;
    };

    player.seekTo = function (pos) {
        console.log('seek to:' + pos);
        if (useNative)
        {
            currentMedia.seekTo(pos);
        }
        else
        {
            currentMedia.currentTime = pos;
        }
    };

    player.pause = function () {
        console.log('ionic-audio: pausing track ' + player.currentTrack.title);

        player.currentTrack.status = 3;
        currentMedia.pause();
        stopTimer();
    };

    player.resume = function () {
        console.log('ionic-audio: resuming track ' + player.currentTrack.title);

        currentMedia.play();
        startTimer();
    };


    player.play = function (trackID) {
        if (trackID == undefined)
        {
            if (player.currentTrack == undefined || player.currentTrack == null)
            {
                player.currentTrack = player.tracks[0];
            }
        }
        else
        {
            player.currentTrack = player.tracks[trackID];
        }

        console.log('MediaManager:playing track ' + player.currentTrack.title);

        if (useNative)
        {
            currentMedia = createMedia(player.currentTrack);
            currentMedia.play();
        }
        else
        {
            playMedia(player.currentTrack);
        }

        startTimer();
    };

    /*
    Creates a new Media from a track object

     var track = {
         url: 'https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3',
         artist: 'The Police',
         title: 'Message in a bottle',
         art: 'img/The_Police_Greatest_Hits.jpg'
     }
     */
    player.addTrack = function (track, onStatusChangeCallback, onProgressCallback) {
        if (!track.url) {
            console.log('missing track url...');
            return;
        }

        angular.extend(track, {
            onStatusChange: onStatusChangeCallback,
            onProgress: onProgressCallback,
            status: 0,
            duration: -1,
            progress: 0
        });
        var index = player.tracks.push(track) - 1;
        player.tracks[index].id = index;
        return index;
    }


    return player;
}])
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
        if ($from == -1) {
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
                }, function (tx, r) { });
            });
            return deferred.promise;
        }

        $http.jsonp(service.server + $channel + '/getarticle.php?type=jsonp&mode=list&from=' + $from + '&&callback=JSON_CALLBACK')
            .success(function (data) {
                if ($from < -1) {
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
            tx.executeSql('insert into newslist(name,content) values(?,?)', [$channel, $json]);
        });
    };

    //get article
    service.getArticle = function ($channel, $id) {
        console.log('service get article...');
        var deferred = $q.defer();

        service.db.transaction(function (tx) {
            tx.executeSql('select * from ' + $channel + ' where id=?', [$id], function (tx, r) {
                if (r.rows.length > 0 && (r.rows.item(0).content != "" && r.rows.item(0).content != null)) {
                    console.log("locad article from database...");
                    deferred.resolve(r.rows.item(0));
                }
                else {
                    console.log("locad article from remote...");
                    $http.jsonp(service.server + $channel + '/getarticle.php?type=jsonp&mode=item&id=' + $id + '&&callback=JSON_CALLBACK')
                        .success(function (data) {
                            service.setArticle($channel, data);
                            deferred.resolve(data);
                        })
                        .error(function () {
                            deferred.reject('error.');
                        });
                }
            }, function (tx, r) { refresh = true; });
        });

        return deferred.promise;
    };
    //set article
    service.setArticle = function ($channel, $article) {
        console.log('service set article...');
        service.db.transaction(function (tx) {
            tx.executeSql('insert into ' + $channel + '(id,title,pic,content,cate,time) values(?,?,?,?,?,?)',
                [$article.id, $article.title, $article.pic, $article.content, $article.cate, $article.time]);
        });
    };

    //get pray book
    service.getPraybook = function ($refresh) {
        console.log('service pray book...');
        var deferred = $q.defer();

        if ($refresh == "" || $refresh == 'undefined') {
            service.db.transaction(function (tx) {
                tx.executeSql('select name,content from newslist where name=?', ['praybook'], function (tx, r) {
                    if (r.rows.length > 0) {
                        var news = r.rows.item(0);
                        deferred.resolve(JSON.parse(news.content));
                    }
                    else {
                        console.log('can not load praybook from local...');
                        $http.jsonp(service.server + 'pray/getprays.php?type=jsonp&callback=JSON_CALLBACK')
                            .success(function (data) {
                                service.setNews('praybook', data);
                                deferred.resolve(data);
                            })
                            .error(function () {
                                deferred.reject('error.');
                            });
                    }
                }, function (tx, r) { });
            });
        }
        else {
            console.log('load pray book from remote...');
            $http.jsonp(service.server + 'pray/getprays.php?type=jsonp&callback=JSON_CALLBACK')
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
