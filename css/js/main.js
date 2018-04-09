var boxDiv1,boxDiv2;
var rightdiv;
var audio;
var volumeWidth;//音量宽度
var sliderTwoWidth;//音乐时长宽度
var transTime;//旋转计时器
var transNum=5;//旋转角度
window.onload = function(){
	boxDiv1 = document.getElementById("box1");
	boxDiv2 = document.getElementById("box2");
	rightdiv= boxDiv2.getElementsByTagName('div');
	audio=document.getElementById("audio");
	volumeWidth=document.getElementById('slidervolume').offsetWidth;
	sliderTwoWidth=document.getElementById('sliderNum').offsetWidth;
	
	for (var i=0;i<rightdiv.length;i++) {
		rightdiv[i].ondragstart = function(e){
			e.dataTransfer.setData("imgID",e.target.id);
		}
	}
	
	boxDiv1.ondragover = function(e){
		e.preventDefault();//去掉浏览器默认的拖放事件处理
	}
	boxDiv2.ondragover = function(e){
		e.preventDefault();//去掉浏览器默认的拖放事件处理
	}
	
	boxDiv1.ondrop = dropImg;
	boxDiv2.ondrop = dropImg;
	musicAudio();
    //当用户已移动/跳跃到音频/视频中的新位置时
    audio.onseeked=function(e){
    	getCurrentTime();
        updateProgressVal();
    }
    //音量调节
    audio.onvolumechange=function(e){
    	var volume=e.srcElement.volume;
    	var progressVal=volume*volumeWidth;
    	document.getElementById('sliderOne').style.width=progressVal+'px';
    }
    
    audio.onloadeddata=function(e){
//  	console.log(11);
        musicAudio();
        updateProgress();
    }
    
    //暂停播放
    audio.onplay=function(e){
    	document.getElementById("playmusic").setAttribute("class","icon iconfont icon-zanting");
    	updateProgress();
		transformImg();//旋转图片
    }
    audio.onpause=function(e){
    	document.getElementById("playmusic").setAttribute("class","icon iconfont icon-bofang");
    	clearInterval(transTime);
    }
    //点击进度条
    document.getElementById('sliderNum').onclick=function(e){
    	var clickwidth=e.offsetX;
    	var progress=(clickwidth/sliderTwoWidth)*audio.duration;
    	document.getElementById("sliderTwo").style.width=clickwidth+"px";
    	audio.currentTime=progress;
    	getCurrentTime();
    }
    //音量点击
	document.getElementById('slidervolume').onclick=function(e){
		var clickwidth=e.offsetX;
		var volume=(clickwidth/volumeWidth);
		document.getElementById("sliderOne").style.width=volume+"px";
		audio.volume=volume;
	}
}

//旋转图片
function transformImg(){
	transTime=setInterval(function(){
		document.getElementById('coverImg').style.cssText="transform: rotate("+transNum+"deg);";
		transNum+=5;
	},100);
}
//拖拽图片
function dropImg(e){
	e.preventDefault();
	var mainId=e.target.id;
	var rightId=e.dataTransfer.getData("imgID");
	//取得box1图片的id  和  box2中拖拽的图片id
	var main=document.getElementById(mainId);
	var right=document.getElementById(rightId);
	
	//分别获取两张图片的src路径，然后进行交换
	var mainsrc=main.getAttribute("src");
	var rightsrc=right.getAttribute("src");
	right.setAttribute("src",mainsrc);
	main.setAttribute("src",rightsrc);
	
	//id交换
	right.setAttribute("id",mainId);
	main.setAttribute("id",rightId);

	//交换歌名
	var mainText=main.nextSibling.nextSibling.innerText;
	var rightText=right.nextSibling.nextSibling.innerText;
	main.nextSibling.nextSibling.innerText=rightText;
	right.nextSibling.nextSibling.innerText=mainText;
	//播放音乐
	audio.getElementsByTagName("source")[0].setAttribute("src","mp3/"+rightId+".mp3");
	document.getElementById('coverImg').setAttribute("src",rightsrc);
	audio.load();
	audio.play();
}
//初始化   总时间
function musicAudio(){
	var totalTime=parseInt(audio.duration/60);
    var seconds=parseInt(audio.duration%60);
//  console.log(audio.duration+","+totalTime+","+seconds);
    if(totalTime==0){
        if(seconds>9){
            totalTime="00:"+seconds;
        }else{
            totalTime="00:0"+seconds;
        }
    }else{
        var totalTimePre,totalTimeNext;
        if(totalTime>9){
            totalTimePre=totalTime;
        }else{
            totalTimePre="0"+totalTime;
        }
        if(seconds>9){
            totalTimeNext=seconds;
        }else{
            totalTimeNext="0"+seconds;
        }
        totalTime=totalTimePre+":"+totalTimeNext;
    }
    document.getElementById("totalTime").innerText=totalTime;
}
//更新当前时间
function getCurrentTime(){
    var currentTime=audio.currentTime;
    var totalTime=parseInt(currentTime/60);
    var seconds=parseInt(currentTime%60);
//  console.log(currentTime+","+totalTime+","+seconds);
    if(totalTime==0){
        if(seconds>9){
            totalTime="00:"+seconds;
        }else{
            totalTime="00:0"+seconds;
        }
    }else{
        var totalTimePre,totalTimeNext;
        if(totalTime>9){
            totalTimePre=totalTime;
        }else{
            totalTimePre="0"+totalTime;
        }
        if(seconds>9){
            totalTimeNext=seconds;
        }else{
            totalTimeNext="0"+seconds;
        }
        totalTime=totalTimePre+":"+totalTimeNext;
    }
    document.getElementById("currentTime").innerText=totalTime;
}

//更新进度条当前值
function updateProgressVal(){
    var progressVal=(audio.currentTime/audio.duration)*sliderTwoWidth;
    document.getElementById("sliderTwo").style.width=progressVal+"px";
}


//暂停或播放
var progressTimer;
function playOrPaused(){
	
    if(audio.paused){
        audio.play();
        document.getElementById("playmusic").setAttribute("class","icon iconfont icon-zanting");
        progressTimer=window.setInterval(audioProgress,100);
        return;
    }
//  window.setTimeout(function(){},1000);
    audio.pause();
    clearInterval(progressTimer);
    document.getElementById("playmusic").setAttribute("class","icon iconfont icon-bofang")
}
//歌曲的进度条
function audioProgress(){
    if(audio.currentTime <audio.duration){
        if(audio.played){
            //更新当前时间
            getCurrentTime();
            //更新进度条
            updateProgressVal();
        }
    }else{
        clearInterval(progressTimer);
    }
}
//增加音量
function addVolume(){
	audio.volume=(audio.volume+0.2>1)?1:audio.volume+0.2;
	document.getElementById("sliderOne").style.width=volumeWidth*(audio.volume)+'px';
}
//减少音量
function reduceVolume(){
	audio.volume=(audio.volume-0.2<0)?0:audio.volume-0.2;
	document.getElementById("sliderOne").style.width=volumeWidth*(audio.volume)+'px';
}
//进度条更新
function updateProgress(){
    progressTimer=window.setInterval(audioProgress,100);
}
var circle1=false;
var circle2=false;
//单曲循环
function singleCircle(){
	if(!circle1){
		circle1=true;
		document.getElementById('singleCircle').style.color="#C62F2F";
		document.getElementById('randomCircle').style.color="#fff";
		audio.onended=function(){
			audio.play();
		}
	}else{
		document.getElementById('singleCircle').style.color="#fff";
		circle1=false;
	}
}
//随机播放
function randomCircle(){
	if(!circle2){
		circle2=true;
		document.getElementById('singleCircle').style.color="#fff";
		document.getElementById('randomCircle').style.color="#C62F2F";
		audio.onended=function(e){
			e.preventDefault();
			var randomNum=parseInt(7*Math.random()+1);
	//		console.log(randomNum);
			var mainId=boxDiv1.getElementsByClassName('content')[0].getElementsByTagName('img')[0].id;
			var rightId="img"+randomNum;
			//取得box1图片的id  和  box2中拖拽的图片id
			var main=document.getElementById(mainId);
			var right=document.getElementById(rightId);
			
			//分别获取两张图片的src路径，然后进行交换
			var mainsrc=main.getAttribute("src");
			var rightsrc=right.getAttribute("src");
			right.setAttribute("src",mainsrc);
			main.setAttribute("src",rightsrc);
			
			//id交换
			right.setAttribute("id",mainId);
			main.setAttribute("id",rightId);
		
			//交换歌名
			var mainText=main.nextSibling.nextSibling.innerText;
			var rightText=right.nextSibling.nextSibling.innerText;
			main.nextSibling.nextSibling.innerText=rightText;
			right.nextSibling.nextSibling.innerText=mainText;
			//播放音乐
			audio.getElementsByTagName("source")[0].setAttribute("src","mp3/"+rightId+".mp3");
			document.getElementById('coverImg').setAttribute("src",rightsrc);
			audio.load();
			audio.play();
		}
	}else{
		document.getElementById('randomCircle').style.color="#fff";
		circle2=false;
	}
}
//快退
function rewind(){
	if(audio.currentTime <=0){
       return;
   }
	audio.currentTime-=20;
	getCurrentTime();
	updateProgress();
}
//快进
function fastForward(){
	if(audio.currentTime >=audio.duration){
       return;
   }
	audio.currentTime+=20;
	getCurrentTime();
	updateProgress();
}
