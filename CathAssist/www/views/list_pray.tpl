{{
	$.ui.titleBar.textContent = it.title;
	$("#backButton")[0].style.visibility = 'hidden';
	$("#menubadge")[0].style.float = 'left';

	$("#shareButton")[0].style.visibility = 'visible';
	sharedMsg = "代祷本（天主教小助手） http://cathassist.org/pray/";
}}
<ul id="pray-list" class="list">
	{{ for (var c in it.items){
	}}
	<li class="artitem">
		<h3 class="arttitle">{{=it.items[c]['name']}}</h3>
		<p class="artcontent">{{=it.items[c]['text']}}</p>
	</li>
	{{}}}
</ul>

<div class="input-group">
	<input id="name" type="text" placeholder="输入你的昵称" value="{{=window.localStorage.getItem('nick') ? window.localStorage.getItem('nick') : ''}}">
	<textarea id="text" rows="6" placeholder="输入你的代祷意向"></textarea>
	<a class="button icon ion-upload" style="float:right;" href="javascript:submitpray()">提交</a>
</div>

<script>
function submitpray()
{
	var _n = $('#name').val();
	var _t = $('#text').val();
	if(_n == "")
	{
		alert("请输入你的昵称！");
		return;
	}
	if(_t == "")
	{
		alert("请输入你的代祷意向！");
		return;
	}
	
	window.localStorage.nick=_n;
	
	$.getJSON(localDB.server+"pray/updateforapp.php?name="+_n+"&text="+_t+"&type=jsonp&callback=?",
		function(obj)
		{
			if(obj.error=="")
			{
				$.mvc.route('/pray');
			}
			else
			{
				alert(obj.error);
			}
		}
	);
};
</script>