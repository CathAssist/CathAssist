{{
	$.ui.titleBar.textContent = it.title;
	$("#backButton")[0].style.visibility = 'hidden';
	$("#menubadge")[0].style.float = 'left';
	$("#shareButton")[0].style.visibility = 'hidden';
}}
<ul id="stuff-list" class="list">
	{{ for (var c in it.items){
		if(it.items[c]['type']=='a')
		{}}
			</ul><h2 class="a">{{=it.items[c]['text']}}</h2><ul id="stuff-list" class="list">
		{{}
		else
		{}}
	<li class="artitem"><a href="{{=it.items[c]['url']}}">
		<h3 class="arttitle">{{=it.items[c]['text']}}</h3>
	</a></li>
		{{}
	}}
	{{}}}
</ul>