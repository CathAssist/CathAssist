/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//获取圣经自动播放的下一章
function getAudioBibleNext(_d)
{
	if(typeof(window.localStorage.autoPlayNextBible)=='undefined')
	{
		window.localStorage.autoPlayNextBible = true;
	}
	try
	{
		if(window.localStorage.autoPlayNextBible!="true")
			return {};
	}catch(err){return {};}
	
	var t = parseInt(_d.substr(1,3));
	var c = parseInt(_d.substr(5,3))+1;
	var item = null;
	
	$.ajax({
		type : "get",
		url : "./res/bible/"+pad3(t)+"/"+pad3(c)+".json",
		async : false,
		success : function(j)
		{
			item = JSON.parse(j);
		},
		error : function(d)
		{
			$.ajax({
				type : "get",
				url : "./res/bible/"+pad3(t+1)+"/"+pad3(1)+".json",
				async : false,
				success : function(j)
				{
					item = JSON.parse(j);
				}
			});
		}
	});
	
	if(item)
	{
		return {title:item.title,src:'http://media.cathassist.org/bible/mp3/cn/male/'+item.mp3,func:getAudioBibleNext,data:item.mp3};
	}
	return {};
}

//获取下一首歌曲
function getAudioMusicNext(_d)
{
	if(typeof(window.localStorage.autoPlayNextMusic)=='undefined')
	{
		window.localStorage.autoPlayNextMusic = true;
	}
	try
	{
		if(window.localStorage.autoPlayNextMusic!="true")
			return {};
	}catch(err){return {};}
	
	localDB.getMusic(function(j) {
		audioPlayer.setAudio(j.name,j.mp3,true,getAudioMusicNext,null);
	});
	return {};
}


var playButton = document.getElementById('playbutton');
var stopButton = document.getElementById('stopbutton');
var activityIndicator = document.getElementById('activityindicator');
var playRange = document.getElementById('playRange');
var playDuration = document.getElementById('playDuration');
stopButton.style.display = 'none';
activityIndicator.style.display = 'none';
playButton.style.display = 'block';
var audioSrcLink = "";
var audioAutoPlay = false;
var audioPlayNextFunc = function(){ return {title:"oec2003",src:"http://bcs.duapp.com/cathassist/music/3rd/wobuzaihu.mp3"};};
var audioPlayNextData = null;


function onError(error) 
{
	console.log(error.message);
}

function onConfirmRetry(button) {
	if (button == 1) {
		audioPlayer.play();
	}
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number
}

function pad3(number) {
	if(number<10)
		return '00'+number;
	else if(number<100)
		return '0'+number;
	return number;
}

function onPlayRangeChange(v)
{
	audioPlayer.seekTo(v);
}

var myaudio = new Audio();
var isPlaying = false;
var readyStateInterval = null;

var audioPlayer = {
	setAudio: function(_t,_l,_p,_f,_d)
	{
		if(typeof(_t)=='undefined')
			return;
        audioPlayNextFunc = null;
		audioPlayNextData = null;
		audioAutoPlay = false;
        if(typeof(_f)!='undefined')
            audioPlayNextFunc = _f;
        if(typeof(_d)!='undefined')
            audioPlayNextData = _d;
        if(typeof(_p)!='undefined')
            audioAutoPlay = _p;
		myaudio.title = _t;
		if(_l!=audioSrcLink)
		{
			audioPlayer.stop();
			audioSrcLink = _l;
			playRange.value = 0;
		}
		$("#playTitle").get(0).textContent=_t;
		playDuration.innerText = '--:--';
		console.log("set audio to new "+myaudio.src);
		if(audioAutoPlay)
		{
			audioPlayer.play();
		}
	},
	play: function()
	{
		isPlaying = true;
		if(myaudio.src!=audioSrcLink)
		{
			myaudio.src = audioSrcLink;
		}
		myaudio.play();
		console.log('set myaudio to play...');
	
		readyStateInterval = setInterval(function(){
			 if (myaudio.readyState <= 2) {
				playButton.style.display = 'none';
				activityIndicator.style.display = 'block';
				playRange.value = 0;
			 }
		},1000);
		myaudio.addEventListener("timeupdate", function() {
			 var s = parseInt(myaudio.duration % 60);
			 var m = parseInt(myaudio.duration / 60);
			 if (isPlaying && myaudio.currentTime > 0)
			 {
				playRange.value = myaudio.currentTime;
				playRange.max = myaudio.duration;
				playDuration.innerText = pad2(m) + ':' + pad2(s);
			 }
		}, false);
		myaudio.addEventListener("error", function() {
			console.log('myaudio ERROR');
			audioPlayer.playNext();
		}, false);
		myaudio.addEventListener("canplay", function() {
			 console.log('myaudio CAN PLAY');
			 if(audioAutoPlay)
			 {
			 	myaudio.play();
			 }
		}, false);
		myaudio.addEventListener("waiting", function() {
			 //console.log('myaudio WAITING');
			 isPlaying = false;
			 playButton.style.display = 'none';
			 stopButton.style.display = 'none';
			 activityIndicator.style.display = 'block';
		}, false);
		myaudio.addEventListener("playing", function() {
			 isPlaying = true;
			 playButton.style.display = 'none';
			 activityIndicator.style.display = 'none';
			 stopButton.style.display = 'block';
		}, false);
		myaudio.addEventListener("ended", function() {
			console.log('myaudio ended');
			audioPlayer.playNext();
		}, false);
	},
	pause: function() {
		isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		stopButton.style.display = 'none';
		activityIndicator.style.display = 'none';
		playButton.style.display = 'block';
	},
	stop: function() {
		isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		stopButton.style.display = 'none';
		activityIndicator.style.display = 'none';
		playButton.style.display = 'block';
		myaudio = null;
		myaudio = new Audio(audioSrcLink);
		playRange.value = 0;
	},
	seekTo: function(v){
		if(myaudio.duration)
		{
			myaudio.currentTime = v;
		}
	},
	playNext: function(){
		audioPlayer.stop();
		if(audioPlayNextFunc)
		{
			var a = audioPlayNextFunc(audioPlayNextData);
			audioPlayer.setAudio(a.title,a.src,true,a.func,a.data);
			return;
		}
	}
};

{
	var dtNow = new Date();
	var title = "今日读经("+dtNow.Format("yyyy-MM-dd")+")";
	var link = "http://media.cathassist.org/thought/mp3/"+dtNow.Format("yyyy-MM-dd")+".mp3";
	audioPlayer.setAudio(title,link,false);
}