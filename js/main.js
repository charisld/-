$(function(){
    // 左侧菜单栏选择
    $('.menu-item>ul>li').click(function(){
        $('.menu-item>ul>li').removeClass('active');
        $(this).addClass('active');
    });
    $('.extend').bind('click',function(){
        var _content=$(this).next('ul');
        if(_content.is(':visible')){
            $(this).css('transform','rotateZ(0deg)');
            _content.hide();
        }else{
            $(this).css('transform','rotateZ(90deg)');
            _content.show();
        }
    });


    // 乐库菜单选择
    $('.music-wrap-item').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        var _index=$(this).index();
        // $('.music-content').eq(_index).addClass('show').siblings().removeClass('show');
        $('.music-content').hide().eq(_index).show();
    });

    // 个性推荐模块
    // 轮播图
      // 下层按钮选项
      $('.choice').hover(function(){
        var choice=$(this);
        picChange(choice);
    });
    $('.choice').click(function(){
        var choice=$(this);
        picChange(choice);
    });

    // 左右按钮的显示
    $('.box-wrap').hover(function(){
        $('.box').show();
    },function(){
        $('.box').hide();
    });

    // 左右按钮的点击
    $('.left-box').click(function(){
        picMove($('.pic-right'));
    });
    $('.right-box').click(function(){
        picMove($('.pic-left'));
    });
    // 定时器
    var timer=setInterval(function(){
        picMove($('.pic-right'));
    },2000);
    $('.box-wrap').hover(function(){
        clearInterval(timer);
    },function(){
        timer=setInterval(function(){
        picMove($('.pic-right'));
     },2000);
    });

    function picMove(select){
        var _index=$('.img-group .pic').index(select);
        var choice=$('.choice').eq(_index);
        picChange(choice);
    }

    function picChange(choice){//选中的span的index值来定位
        $('.choice').removeClass('active');
        choice.addClass('active');
        var _index=choice.index();
        var current=$('.pic').removeClass().addClass('pic pic-home').eq(_index);
        current.removeClass('pic-home').addClass('pic-center');
        // console.log($('.pic').length);
        if(_index==($('.pic').length-1)){
            $('.pic:first-child').removeClass('pic-home').addClass('pic-right');
            current.prev().removeClass('pic-home').addClass('pic-left');
        }else if(_index==0){
            $('.pic:last-child').removeClass('pic-home').addClass('pic-left');
            current.next().removeClass('pic-home').addClass('pic-right');
        }else{
            current.prev().removeClass('pic-home').addClass('pic-left');
            current.next().removeClass('pic-home').addClass('pic-right');
        }
    }

    // 当前播放歌曲
    $('.present-m').hover(function(){
        $('.cover').show();
    },function(){
        $('.cover').hide();
    });

    //静音按钮
    var audio=$('#audio').get(0);
    audio.load();
    var voice=$('.voice-pro').css('width');
    $('.voice').click(function(){
        if( $(this).attr('src')=='image/voice.png'){
            $(this).attr('src','image/静音.png');
            // $('.voice-pro').css('width','0px');
            // audio.volume=0;
            audio.muted=true;
        }else{
            $(this).attr('src','image/voice.png');
    
            audio.muted=false;
        }
    });

    
    //发现音乐
    $('.found').click(function(){
        $('.search').hide();
        $('.playlist').hide();
        $('.lyric').hide();
        $('.music').show();
    });
    //热门歌曲的点击
    $('.re-item').click(function(){
        $('.playlist').show();
        $('.music').hide();
        $('.lyric').hide();
    });



});