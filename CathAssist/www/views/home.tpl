{{
	$.ui.titleBar.textContent = it.title;
	$("#backButton")[0].style.visibility = 'hidden';
	$("#menubadge")[0].style.float = 'left';

	$("#shareButton")[0].style.visibility = 'hidden';
}}
<h2>首页</h2>
<ul class="list">
	 <li>
		<a href="/stuff/detail/{{=it.date.Format("yyyy-MM-dd")}}/thought" data-ignore="true">今日福音</a>
	</li>
	 <li>
		<a href="{{=(window.localStorage.lastbible ? window.localStorage.lastbible : '/bible/')}}" data-ignore="true">最近读经</a>
	</li>
</ul>