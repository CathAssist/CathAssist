{{
	if(!art_next_to){var art_next_to=-3;}
	$.ui.titleBar.textContent = it.item.title;
	var bb = $("#backButton")[0];
	bb.href=it.list+(parseInt(art_next_to)+1);
	bb.innerHTML= it.text;
	bb.style.visibility = 'visible';
	$("#menubadge")[0].style.float = 'right';

	$("#shareButton")[0].style.visibility = 'visible';
	sharedMsg = it.item.title+" http://cathassist.org/getarticle/getarticle.php?sub="+it.sub+"&id="+it.item.id+" 来自：天主教小助手";
}}
<div id="stuff_title"><h2>{{=it.item.title}}</h2></div>
<div id="stuff_detail">
{{=replackAudioTag(it.item.content)}}
</div>