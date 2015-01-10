{{
	$.ui.titleBar.textContent = it.title;
	$("#backButton")[0].style.visibility = 'hidden';
	$("#menubadge")[0].style.float = 'left';
	$("#shareButton")[0].style.visibility = 'hidden';
}}
<div class="gap">
	<div class="button-grouped flex">
		<a class="button icon ion-refresh" href="{{=it.list}}9999999/update">更新</a>
	</div>
</div>
<ul id="stuff-list" class="list">
	{{ for (var c in it.items){
	}}
	<li class="artitem"><a href="{{=it.item}}{{=it.items[c]['id']}}">
		{{if(it.items[c]['pic'] && it.items[c]['pic']!=''){}}
		<img src="{{=it.items[c]['pic']}}" class="artimg" />
		{{}}}
		<h3 class="arttitle">{{=it.items[c]['title']}}</h3>
		<p class="artcontent">{{=it.items[c]['title']}}</p>
	</a></li>
	{{}}}
</ul>
<div class="button-grouped flex">
	<a class="button icon ion-arrow-left-b" href="{{=it.back}}{{=art_next_to}}">上一页</a>
	<a class="button icon ion-arrow-right-b" href="{{=it.list}}{{=art_next_from}}/update">下一页</a>
</div>
