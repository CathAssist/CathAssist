{{
	$.ui.titleBar.textContent = it.items.title;
	
	var bb = $("#backButton")[0];
	bb.href=it.url;
	bb.innerHTML= it.title;
	bb.style.visibility = 'visible';
	$("#menubadge")[0].style.float = 'right';

	$("#shareButton")[0].style.visibility = 'hidden';
}}
<ul id="stuff-list" class="list">
	{{ for (var c in it.items.items){
		if(it.items.items[c]['type']=='b')
		{}}
			</ul><h2 class="a">{{=it.items.items[c]['text']}}</h2><ul id="stuff-list" class="list">
		{{}
		else
		{}}
	<li class="artitem"><a href="{{=it.items.items[c]['url']}}">
		<h3 class="arttitle">{{=it.items.items[c]['text']}}</h3>
	</a></li>
		{{}
	}}
	{{}}}
</ul>