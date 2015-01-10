//首页
$.mvc.controller.create('home', {
    views: {
        "home_tpl": "views/home.tpl"
    },
    default:function() {
		$.ui.showMask("加载首页...");
		
		$("#main").html($.template('home_tpl', {
			title: '天主教小助手',
			date: new Date()
		}));
		$.ui.hideMask();
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	
	init: function(){
		var self = this;
	}
});

//日课及读经
var stuffconfig = {'mass':'弥撒','med':'日祷','comp':'夜祷','let':'诵读','lod':'晨祷','thought':'反省','ordo':'礼仪','ves':'晚祷','saint':'圣人传记'};
$.mvc.controller.create('stuff', {
    views: {
        "list_stuff_tpl": "views/list_stuff.tpl",
		"stuff_detail_tpl": "views/stuff_detail.tpl"
    },
    default:function() {
		$.ui.showMask("加载日课及读经...");
		var dtNow = new Date();
		this.getstuff(dtNow.Format("yyyy-MM-dd"));
    },
    /* This is executed when the controller is created.  It assumes the views are loaded, but can not interact with models
     * This is useful for wiring up page events, etc.
     */
    init: function() {
        var self = this;
    },
	update: function(_d) {
		$.ui.showMask("更新日课及读经...");
		var dtNow = new Date();
		if(_d)
		{
			dtNow = new Date(_d);
		}
		
		localDB.updateStuff(dtNow.Format("yyyy-MM-dd"),function(all) {
			$("#main").html($.template('list_stuff_tpl', {
				title: '日课及读经',
				stuff: all,
				date: dtNow
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	getstuff: function(_d,_u)
	{
		$.ui.showMask("加载日课及读经...");
		var dtNow = new Date(_d);
		localDB.getStuff(dtNow.Format("yyyy-MM-dd"),'',function(all) {
			$("#main").html($.template('list_stuff_tpl', {
				title: '日课及读经',
				stuff: all,
				date: dtNow
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	detail: function(_d,_t)
	{
		localDB.getStuff(_d,_t,function(t) {
			$("#main").html($.template('stuff_detail_tpl', {
                type: _t,
                stuff: t,
				date: _d
            }));
		});
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	}
});


$.mvc.controller.create('article', {
    views: {
        "list_article_tpl": "views/list_article.tpl",
        "article_detail_tpl":"views/article_detail.tpl"
    },
	//普世教会文章
    vaticanacn:function(from,r) {
		$.ui.showMask("加载普世教会...");
		var refresh = true;
		if((!r)||(r==""))
		{
			refresh = false;
		}
		if((!from)||(from==""))
		{
			from="-1";
		}
		from = parseInt(from);
		localDB.getVaticanacnList(from,function(all) {
			art_next_from = all[all.length-1].id;
			art_next_to = all[0].id;
            $("#main").html($.template('list_article_tpl', {
                title: "普世教会",
                items: all,
				list: '/article/vaticanacn/',
				item: '/article/vaticanacn_item/',
				back: '/article/vaticanacn_back/',
				sub: 'vaticanacn'
            }));
			
			$.ui.hideMask();
		},refresh);
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	vaticanacn_back:function(to)
	{
		if((!to)||(to==""))
		{
			to='-1';
		}
		to = parseInt(to);
		if(to<1)
			return;
		$.ui.showMask("加载普世教会...");
		localDB.getVaticanacnBackList(to,function(all) {
			if(all.length<1)
			{
				$.ui.hideMask();
				return;
			}
			art_next_from = all[all.length-1].id;
			art_next_to = all[0].id;
            $("#main").html($.template('list_article_tpl', {
                title: "普世教会",
                items: all,
				list: '/article/vaticanacn/',
				item: '/article/vaticanacn_item/',
				back: '/article/vaticanacn_back/',
				sub: 'vaticanacn'
            }));
			
			$.ui.hideMask();
		});
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	vaticanacn_item:function(id) {
		$.ui.showMask("加载文章...");
		localDB.getVaticanacnItem(id,function(all) {
			$("#main").html($.template('article_detail_tpl', {
                item: all,
				list: '/article/vaticanacn/',
				text: '普世教会',
				sub: 'vaticanacn'
            }));
			$.ui.hideMask();
		});
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	//信仰生活文章
    faithlife:function(from,r) {
		$.ui.showMask("加载信仰生活...");
		var refresh = true;
		if((!r)||(r==""))
		{
			refresh = false;
		}
		if((!from)||(from==""))
		{
			from="-1";
		}
		from = parseInt(from);
		localDB.getFaithLifeList(from,function(all) {
			art_next_from = all[all.length-1].id;
			art_next_to = all[0].id;
            $("#main").html($.template('list_article_tpl', {
                title: "信仰生活",
                items: all,
				list: '/article/faithlife/',
				item: '/article/faithlife_item/',
				back: '/article/faithlife_back/',
				sub: 'faithlife'
            }));
			
			$.ui.hideMask();
		},refresh);
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	faithlife_back:function(to)
	{
		if((!to)||(to==""))
		{
			to='-1';
		}
		to = parseInt(to);
		if(to<1)
			return;
		$.ui.showMask("加载信仰生活...");
		localDB.getFaithLifeBackList(to,function(all) {
			if(all.length<1)
			{
				$.ui.hideMask();
				return;
			}
			art_next_from = all[all.length-1].id;
			art_next_to = all[0].id;
            $("#main").html($.template('list_article_tpl', {
                title: "信仰生活",
                items: all,
				list: '/article/faithlife/',
				item: '/article/faithlife_item/',
				back: '/article/faithlife_back/',
				sub: 'faithlife'
            }));
			
			$.ui.hideMask();
		});
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	faithlife_item:function(id) {
		$.ui.showMask("加载文章...");
		localDB.getFaithLifeItem(id,function(all) {
			$("#main").html($.template('article_detail_tpl', {
                item: all,
				list: '/article/faithlife/',
				text: '信仰生活',
				sub: 'faithlife'
            }));
			$.ui.hideMask();
		});
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	
	//主内分享文章
    articles:function(from,r) {
		$.ui.showMask("加载主内分享...");
		var refresh = true;
		if((!r)||(r==""))
		{
			refresh = false;
		}
		if((!from)||(from==""))
		{
			from="-1";
		}
		from = parseInt(from);
		localDB.getArticlesList(from,function(all) {
			art_next_from = all[all.length-1].id;
			art_next_to = all[0].id;
            $("#main").html($.template('list_article_tpl', {
                title: "主内分享",
                items: all,
				list: '/article/articles/',
				item: '/article/articles_item/',
				back: '/article/articles_back/',
				sub: 'articles'
            }));
			
			$.ui.hideMask();
		},refresh);
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	articles_back:function(to)
	{
		if((!to)||(to==""))
		{
			to='-1';
		}
		to = parseInt(to);
		if(to<1)
			return;
		$.ui.showMask("加载主内分享...");
		localDB.getArticlesBackList(to,function(all) {
			if(all.length<1)
			{
				$.ui.hideMask();
				return;
			}
			art_next_from = all[all.length-1].id;
			art_next_to = all[0].id;
            $("#main").html($.template('list_article_tpl', {
                title: "主内分享",
                items: all,
				list: '/article/articles/',
				item: '/article/articles_item/',
				back: '/article/articles_back/',
				sub: 'articles'
            }));
			
			$.ui.hideMask();
		});
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	articles_item:function(id) {
		$.ui.showMask("加载文章...");
		localDB.getArticlesItem(id,function(all) {
			$("#main").html($.template('article_detail_tpl', {
                item: all,
				list: '/article/articles/',
				text: '主内分享',
				sub: 'articles'
            }));
			$.ui.hideMask();
		});
		
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
    /* This is executed when the controller is created.  It assumes the views are loaded, but can not interact with models
     * This is useful for wiring up page events, etc.
     */
    init: function() {
        var self = this;
    }
});


//代祷本
$.mvc.controller.create('pray', {
    views: {
        "list_pray_tpl": "views/list_pray.tpl"
    },
	
    default:function() {
		$.ui.showMask("加载代祷意向...");
		localDB.getPray(function(all) {
			$("#main").html($.template('list_pray_tpl', {
				title: '彼此代祷',
				items: all
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	
	init: function(){
		var self = this;
	}
});

//梵蒂冈广播
$.mvc.controller.create('radio', {
    views: {
        "radio_tpl": "views/radio.tpl"
    },
	
    default:function() {
		$.ui.showMask("加载梵蒂冈广播...");
		localDB.getRadio(function(all) {
			$("#main").html($.template('radio_tpl', {
				title: '梵蒂冈广播',
				item: all
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	
	init: function(){
		var self = this;
	}
});

//色辣芬电台
$.mvc.controller.create('music', {
    views: {
        "music_tpl": "views/music.tpl"
    },
	
    default:function() {
		$.ui.showMask("加载色辣芬电台...");
		localDB.getMusic(function(all) {
			$("#main").html($.template('music_tpl', {
				title: '色辣芬电台',
				item: all
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	
	init: function(){
		var self = this;
	}
});

//设置
$.mvc.controller.create('settings', {
    default:function() {
		$.ui.showMask("加载设置...");
		$.get("./res/settings.html",function(j){
			$("#main").html(j);
			checkAutoPlayNext();	//设置按钮状态
			checkFontSize();		//设置字体大小状态
			
			$.ui.titleBar.textContent = '设置';
			$("#backButton")[0].style.visibility = 'hidden';
			$("#menubadge")[0].style.float = 'left';
			$("#shareButton")[0].style.visibility = 'hidden';
			$.ui.hideMask();
		});
		$.ui.hideMask();
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	
	init: function(){
		var self = this;
	}
});

//思高圣经
$.mvc.controller.create('bible', {
    views: {
        "bible_tpl": "views/bible.tpl",
		"template_tpl": "views/template.tpl",
		"chapter_tpl": "views/chapter.tpl"
    },
	
    default:function() {
		$.ui.showMask("加载思高圣经...");
		$.get("./res/bible/index.json",function(j){
			$("#main").html($.template('bible_tpl', {
				title: '思高圣经',
				items: JSON.parse(j)
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	template:function(t)
	{
		$.get("./res/bible/"+t+"/index.json",function(j)
		{
			$("#main").html($.template('template_tpl', {
				title: '思高圣经',
				url: '/bible',
				items: JSON.parse(j)
			}));
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	chapter:function(t,c)
	{
		$.get("./res/bible/"+t+"/"+c,function(j)
		{
			window.localStorage.lastbible = '/bible/chapter/'+t+'/'+c;
			$("#main").html($.template('chapter_tpl', {
				title: '思高圣经',
				url: '/bible',
				furl: 'bible/bible/'+t+'/'+c,
				items: JSON.parse(j)
			}));
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	
	init: function(){
		var self = this;
	}
});

//常用经文
$.mvc.controller.create('prayer', {
    default:function() {
		$.ui.showMask("加载常用经文...");
		$.get("./res/prayer/index.html",function(j){
			$("#main").html(j);
			
			$.ui.titleBar.textContent = '常用经文';
			$("#backButton")[0].style.visibility = 'hidden';
			$("#menubadge")[0].style.float = 'left';

			$("#shareButton")[0].style.visibility = 'visible';
			sharedMsg = "常用祈祷经文（天主教小助手） http://cathassist.org/prayer/";
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	
	init: function(){
		var self = this;
	}
});

//天主教教理
$.mvc.controller.create('catechism', {
    views: {
        "catechism_tpl": "views/catechism.tpl",
		"chapter_tpl": "views/chapter.tpl"
    },
	
    default:function() {
		$.ui.showMask("加载天主教教理...");
		$.get("./res/catechism/index.json",function(j){
			$("#main").html($.template('catechism_tpl', {
				title: '教理',
				items: JSON.parse(j)
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	chapter:function(c)
	{
		$.get("./res/catechism/"+c,function(j)
		{
			$("#main").html($.template('chapter_tpl', {
				title: '教理',
				url: '/catechism',
				furl: 'catechism/content/'+c,
				items: JSON.parse(j)
			}));
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	
	init: function(){
		var self = this;
	}
});

//天主教法典
$.mvc.controller.create('codex', {
    views: {
        "codex_tpl": "views/catechism.tpl",
		"chapter_tpl": "views/chapter.tpl"
    },
	
    default:function() {
		$.ui.showMask("加载天主教法典...");
		$.get("./res/codex/index.json",function(j){
			$("#main").html($.template('codex_tpl', {
				title: '法典',
				items: JSON.parse(j)
			}));
			$.ui.hideMask();
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
    },
	chapter:function(c)
	{
		$.get("./res/codex/"+c,function(j)
		{
			$("#main").html($.template('chapter_tpl', {
				title: '法典',
				url: '/codex',
				furl: 'codex/content/'+c,
				items: JSON.parse(j)
			}));
		});
		$.ui.scrollToTop("#mainc",-10);
		if($.ui.isSideMenuOn())
			$.ui.toggleSideMenu();
	},
	
	init: function(){
		var self = this;
	}
});



//初始化当前页面
var _u = getQueryString('route');
if(!_u)
{
	_u = "/stuff";
}
$.mvc.route(_u);