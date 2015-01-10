{{
	$.ui.titleBar.textContent = stuffconfig[it.type];
	var bb = $("#backButton")[0];
	bb.href="/stuff/getstuff/"+it.date;
	bb.innerHTML= '日课...';
	bb.style.visibility = 'visible';
	$("#menubadge")[0].style.float = 'right';

	$("#shareButton")[0].style.visibility = 'visible';
	sharedMsg = stuffconfig[it.type]+"("+it.date+") http://cathassist.org/getstuff/stuff/"+it.date+"_"+it.type+".html"+" 来自：天主教小助手";
}}
<div id="stuff_detail">
{{=replackAudioTag(it.stuff)}}
</div>