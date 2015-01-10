{{
	$.ui.titleBar.textContent = it.title;
	$("#backButton")[0].style.visibility = 'hidden';
	$("#menubadge")[0].style.float = 'left';

	$("#shareButton")[0].style.visibility = 'visible';
	sharedMsg = it.item.singer+":"+it.item.name+" http://cathassist.org/music/music.php?id="+it.item.id+" 来自：天主教小助手";
}}
<div class="main-content music-info">
	<h3>歌名：{{=it.item.name}}</h3>
	<h3>专辑：{{=it.item.alume}}</h3>
	<h3>歌手：{{=it.item.singer}}</h3>
	<img src="{{=it.item.pic}}"></img>
</div>
<div class="button-grouped flex">
	<a class="button icon ion-play" href="javascript:void(0)" onclick="audioPlayer.setAudio('{{=it.item.name}}','{{=it.item.mp3}}',true,getAudioMusicNext,null);">播放歌曲</a>
	<a class="button icon ion-arrow-right-b" href="/music">下一首</a>
</div>
