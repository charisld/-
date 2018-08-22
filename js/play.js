$(function(){
    var index=0;
    // 歌曲的初始化
    // var audioArry=$('#audio source');
    // console.log(audioArry.length);
    var audio=$('#audio').get(0);
    audio.load();
    audio.volume =$('.voice-bar .voice-pro').width()/$('.voice-bar').width();
    //时间转换函数
    function time(time){
        var minutes= parseInt(time/60);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var seconds= Math.round(time%60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var showTime=minutes+':'+seconds;
        //返回00:00格式数据
        return showTime;
    }

    function duration(){
        // audioError();
        var mTime=audio.duration;
        // console.log(mTime);
        var showText=time(mTime);
        $('.end-time').text(showText);
    }
    audio.onloadedmetadata=duration;
   
    var playTime;
    var playMusic;
    var deg=0;
    // console.log($('.voice-bar .voice-pro').width());

    //播放和暂停按钮之间的切换
    $('.btn-play').click(function(){
        //暂停：1图片切换，2歌曲暂停，3清除计时器
        if($('.btn-play').hasClass('play')){
            $('.btn-play').removeClass('play').addClass('no-play');
            audio.pause();
            clearInterval(playMusic);
        }else{
            //播放：1图片切换，2歌曲播放，3加载计时器：（1）左侧时间的替换（2）进度条的自动前进
            $('.btn-play').removeClass('no-play').addClass('play');
            audio.play();
            autoPlay(); 
        }
    });
    function autoPlay(){
        playMusic=setInterval(function(){
            playTime=audio.currentTime;
            // console.log(playTime);
            // var leftTime=$('.pro-buffer').width()/$('.pro-bar').width()*audio.duration;
            var showText=time(playTime);
            $('.start-time').text(showText);
            var left=playTime/audio.duration*$('.pro-bar').width();
            $('.pro-bar .pro-circle').css('left',left+'px');
            $('.pro-bar .pro-buffer').css('width',left+'px');
            // console.log('外面的deg='+deg);
            $('.img-wrap').css('transition','1s linear');
            // console.log($('.lyric').css('display')=='block');
            //背景图片旋转问题，待解决
            if($('.lyric').css('display')=='block'){
                // console.log('deg='+deg);
                deg=(deg+10)%360;
                $('.img-wrap').css('transform','rotate('+deg+'deg)');
                // if(deg>=360){deg=0;}
                // console.log('transition')
            } 
            // if(deg==360){
            //     $('.img-wrap').css('transition','0s');
            //     deg=0;
            // } 
        },1000);
   
    }

    // 进度条的圆点拖动
    var flag=false;
    var moveDis;
    $('.pro-circle').mousedown(function(){
        console.log('鼠标按下');
        var leftTime;
        flag=true;
        var current=$(this);
        var halfW=current.width()/2;
        var startPosition= parseInt(current.position().left-halfW);
        var distance=parseInt(current.offset().left-startPosition); 
        // console.log('distance='+distance);
       var moveCircle=function(e){
            if(flag){
                if(current.parent().hasClass('pro-bar')){
                    clearInterval(playMusic); 
                    leftTime=parseInt($('.pro-buffer').width()/$('.pro-bar').width()*audio.duration);
                    var showText=time(leftTime);
                    $('.start-time').text(showText);
                }
               
                // console.log(current.parent().html());
                // console.log('当前时间='+audio.currentTime);
                // console.log('总时间='+audio.duration);
               moveDis=parseInt(e.clientX-distance-halfW);
                // console.log('current='+current.parent().hasClass('pro-bar'));
                // console.log('halfW='+halfW);
                // console.log('distance='+distance);
                // console.log('moveDis='+moveDis);
                // console.log('======================================');
                if(moveDis<0){
                    current.css('left','0px');
                    current.prev().css('width','0px');
                }else if(moveDis>current.parent().width()){
                    current.css('left',current.parent().width()-halfW+'px');
                    current.prev().css('width',current.parent().width()+'px');
                }else{
                    current.css('left',moveDis-halfW+'px');
                    // console.log('当前元素的左边='+current.css('left'));
                    current.prev().css('width',moveDis+'px');
                    // console.log('兄弟元素的宽度='+current.prev().css('width'));
                }
                if(current.parent().hasClass('voice-bar')){
                    // console.log(audio.volume);
                    audio.volume = current.prev().width()/current.parent().width();
                }
            }
        }
        var upCricle=function(){
            if(current.parent().hasClass('pro-bar')){
                audio.currentTime=leftTime;
                console.log('当前播放时间为：'+leftTime);
            }
            console.log('鼠标松开');
            $(document).unbind('mousemove',moveCircle);
            $(document).unbind('mouseup',upCricle);
            flag=false;
            autoPlay();

        }
        
        $(document).bind('mousemove',moveCircle);
        $(document).bind('mouseup',upCricle);
        
    });
    $('.pro-bar').click(function(e){
        var dis=e.clientX-256;
        $('.pro-bar .pro-circle').css('left',dis+'px');
        $('.pro-buffer').css('width',dis+'px');
        audio.currentTime=dis/$('.pro-bar').width()*audio.duration;
        // console.log('当前播放时间为='+audio.currentTime);
    });

    
    // 检查音频元素的就绪状态：
    function audioError() {
        // 0 = HAVE_NOTHING - 没有关于音频是否就绪的信息
        // 1 = HAVE_METADATA - 关于音频就绪的元数据
        // 2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
        // 3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
        // 4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
        var readynum=audio.readyState;
        console.log('readynum='+readynum);
    }

    

    // 音量的控制圆圈的显示
    var voiceCir=$('.voice-bar .pro-circle');
    var voiceWrap=$('.voice-wrap');
    voiceWrap.hover(function(){
        voiceCir.show();
    },function(){
        voiceCir.hide();
    });

    //================当前播放音乐（左下角）===========
    function currentSong(){
        var playList=$('.result-list tbody tr');
        var songName=playList.eq(index).find('.songName').text();
        var artistName=playList.eq(index).find('.artistName').text();
        var albumImg=playList.eq(index).find('.albumImg').text();
        var currentId=playList.eq(index).find('.songId').text();
        $('.currentsong').text(songName);
        $('.singer').text(artistName);
        $('.present-m img').attr('src',albumImg);
        $('.lyric-wrap .img-wrap img').attr('src',albumImg);
        $('.currentId').text(currentId);
    }

    var index;
    //双击歌曲播放
   $('.result-list tbody').on('dblclick','tr',function(){
    $('.result-list tbody tr th').removeClass();
    $(this).find('th').addClass('playing');
    index=$(this).index();
    var songSrc="http://music.163.com/song/media/outer/url?id="+$(this).find('.songId').text()+'.mp3';
    $('#audio').attr('src',songSrc);
    console.log($('#audio').attr('src'));
    audio.play();
    autoPlay();
    $('.btn-play').removeClass('no-play').addClass('play');
    currentSong();
   });

   //===================上一曲和下一曲的切换=================
   function changeSong(oper){
       var playList=$('.result-list tbody tr');
       //上一曲
       if(oper==0){
            if(index==0){
                index=playList.length-1;
            }else{
                index--;
            }
       }else{
            if(index==playList.length-1){
                index=0;
            }else{
                index++;
            }
       }
        var newSrc="http://music.163.com/song/media/outer/url?id="+playList.eq(index).find('.songId').text()+'.mp3';
        // console.log('newSrc='+newSrc);
        console.log('index='+index);
        $('#audio').attr('src',newSrc);
        playList.find('th').removeClass();
        playList.eq(index).find('th').addClass('playing');
        audio.play();
        autoPlay();
        $('.btn-play').removeClass('no-play').addClass('play');
        currentSong();
   }
    $('.btn-prev').click(function(){
        //0代表上一曲，1代表下一曲
        changeSong(0);
    });
    $('.btn-next').click(function(){
        changeSong(1);
    })
 
});
