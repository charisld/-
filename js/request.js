
function requestAPI(req){
    $.ajax({
        type:'GET',
        url:req.url,
        data:req.data,
        // dataType:"json",
        success:function(res){
            // console.log(res);
            //将str->json格式
            // req.callback(JSON.parse(res));
            req.callback(JSON.parse(res));
        },
        error:function(err){
            console.warn(err.status);
            // console.log("API请求错误="+err.status);
        }
    });
}



//==========搜索=============
function search(str){
    $('.music').hide();
    $('.lyric').hide();
    $('.main-menu').show();
    $('.search').show();
    $('.search-top .s').text(str); 
    $.ajax({
        url:"http://s.music.163.com/search/get/",
        type:"GET",
        data:{
            s:str,
            limit:100,
            type:1
        },
        dataType:"jsonp",
		jsonp:"callback",
		success:function (res) {	
            // console.log(res);	
            if(res.result){	
                $('.result-list thead').show();	
                $('.songCount').text(res.result.songCount);
                var len=res.result.songs.length;
                var content='';
                var j=1;
                // +res.result.songs[i].id+
                for(var i=0;i<len;i++){
                    content+='<tr><th>'+(j++)+'</th>'
                            +'<td><span></span></td>'
                            +'<td class="songName">'+res.result.songs[i].name+'</td>'
                            +'<td class="artistName">'+res.result.songs[i].artists[0].name+'</td>'
                            +'<td>'+res.result.songs[i].album.name+'</td>'
                            +'<td></td><td class="songId">'+res.result.songs[i].id+'</td><td class="albumImg">'+res.result.songs[i].album.picUrl+'</td></tr>'
            }
            }else{
                $('.songCount').text(0);
               content="没有这首歌~~换个关键词吧！";
               $('.result-list thead').hide();
            }
            $('.result-list tbody').html(content).css('text-align','center');
		},
		error:function (err) {
			console.warn(err.status);
		}
    });
}
$('#search-box').submit(function(){
    var value=$('.search-text').val();
    if(value){
      search(value);
    }
    return false; 
});


//=============json数据====================
//get_playlist_info
//data.result是必须的
//data.result.coverImgUrl是专辑的封面图
//data.result.creator是专辑创建者的信息    avatarUrl是头像   backgroundUrl是个人空间背景图片
//data.result.tracks是专辑内歌曲的信息   

//推荐歌单
//热门歌单
function hotList(data){
    var img=$('.recommend .re-item>img');
    var caption=$('.recommend .caption');
    var listId=$('.recommend .list-id');
    // console.log(data);
    for(var i=0;i<img.length;i++){
        img.eq(i).attr('src',data.playlists[i].coverImgUrl);
        caption.eq(i).text(data.playlists[i].name);
        listId.eq(i).text(data.playlists[i].id);
    }

}
function initCommend(data){
    // console.log('返回的数据='+data);
    // console.log("init函数");
    var arry=$('.recommend .re-item>img');
    // console.log(arry[0]);
    for(var i=0;i<arry.length;i++){                  
        arry.eq(i).attr('src',data.result.coverImgUrl);
    }
    
}
//轮播图
function autoPlay(data){
    var imgArry=$('.auto-play .img-group img');
    for(var i=0;i<imgArry.length;i++){
        imgArry.eq(i).attr('src',data.albums[i].picUrl);
    }
}

function lyricCut(lyric){
    var lyricArry=[];
    lyricArry=lyric.split('\n');
    console.log(lyricArry);
    var wordsArry=[];
    for(var i=0;i<lyricArry.length;i++){
        wordsArry[i]=lyricArry[i].slice(10)+'<br/>';
    }
    $('.music-lyric').html(wordsArry).css({'color':'#333',"font-size":'14px'});

}

//歌词页面
function lyric(data){
    // console.log(data);
    $('.music-name').text($('.currentsong').text());
    $('.music-singer').text($('.singer').text());
    if(data.lrc){
        // $('.music-lyric').html(data.lrc.lyric);
        lyricCut(data.lrc.lyric);
    }else{
        $('.music-lyric').html("暂无歌词");
    }
    $('.music-album').text('未知');
    $('.music-ori').text('未知');
}

function changeSong(){
    //当前歌曲歌词获取
     var _id=$('.currentId').text();
    //  console.log(_id);
     requestAPI({
             url:'../../js/api.php',
             data:{
                 "API_type":"get_music_lyric",
                 "queryString":{
                     "id":_id
                 }
             },
             callback:function(data){
                lyric(data);
             }
     });
     }

//------------------- 歌曲推荐的信息获取-----------------
$(function(){
    requestAPI({
        url:'../../js/api.php',
        data:{
            "API_type":"get_music_info",
            "queryString":{
                "id":408328050
            }
        },
        callback:function(data){
            // console.log(data);
            var _initId=data.songs[0].id;
            var _initPic=data.songs[0].album.picUrl;
            var _initSong=data.songs[0].name;
            var _initSinger=data.songs[0].artists[0].name;
            var _initUrl="http://music.163.com/song/media/outer/url?id="+_initId+".mp3";
            $('#audio').attr('src',_initUrl);
            $('.present-m .currentId').text(_initId);
            $('.present-m .album img').attr('src',_initPic);
            $('.present-m .currentsong').text(_initSong);
            $('.present-m .singer').text(_initSinger);
            $('.lyric .img-wrap img').attr('src',_initPic);
            $('.music-name').text(_initSong);
            $('.music-singer').text(_initSinger);
            // console.log('专辑名称='+data.songs[0].album.name);
            $('.music-album').text(data.songs[0].album.name);
            $('.music-ori').text();
        }
    });
    //热门歌单请求
    requestAPI({
        url:'../../js/api.php',
        data:{
            "API_type":"get_hot_playlist",
            "queryString":{
                "limit":"10",
                "type":"hot"
            }
        },
        callback:function(data){
            // consconsole.log(data);
            hotList(data);
        }
    });
    //新专辑请求
   requestAPI({
       url:'../../js/api.php',
       data:{
            "API_type":"get_new_ablum",
            "queryString":{
                "limit":8
            }
       },
       callback:function(data){
            autoPlay(data);
       }
   });
//    $('.cover').click(function(){
   $('.cover').click(function(){
       changeSong();
   });
   $('.btn-prev').click(function(){
       changeSong();
   });
   $('.btn-next').click(function(){
       changeSong();
   });

   //data.result是必须的
//data.result.coverImgUrl是专辑的封面图
//data.result.creator是专辑创建者的信息    avatarUrl是头像   backgroundUrl是个人空间背景图片
//data.result.tracks是专辑内歌曲的信息   

   function playlist(data){
       console.log(data); 
       var _albumPic=data.result.coverImgUrl;//专辑封面
       var _albumName=data.result.name;//专辑名字
       var _albumCreator=data.result.creator.nickname;//专辑创建者昵称
       var _albumava=data.result.creator.avatarUrl;//创建者的头像
    //    console.log(_albumava);
       $('.playlist .albumpic img').attr('src',_albumPic);
       $('.playlist .albumname').text(_albumName);
       $('.playlist .setuser').text(_albumCreator);
       $('.playlist .seterpic').css('background-image','url('+_albumava+')');
        var _len=data.result.tracks.length;
        var listContent=[];
        var j=1;
        for(var i=0;i<_len;i++){
            listContent+='<tr><th>'+(j++)+'</th>'
            +'<td><span></span></td>'
            +'<td class="songName">'+data.result.tracks[i].name+'</td>'
            +'<td class="artistName">'+data.result.tracks[i].artists[0].name+'</td>'
            +'<td>'+data.result.tracks[i].album.name+'</td>'
            +'<td></td><td class="songId">'+data.result.tracks[i].id+'</td><td class="albumImg">'+data.result.tracks[i].album.picUrl+'</td></tr>'
        }
        $('.albumsongs tbody').html(listContent);
    }
   //热门歌单的点击事件
   $('.re-item').click(function(){
        console.log('歌单的点击事件');
        var mListId=$(this).find('.list-id').text();
        requestAPI({
            url:'../../js/api.php',
            data:{
                "API_type":"get_playlist_info",
                "queryString":{
                    "id":mListId
                }
            },
            callback:function(data){
               playlist(data);
            }
        });
   });
  
  
});
