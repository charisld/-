$(function(){
    $('.cover').click(function(){
        $('.main-menu').hide();
        $('.lyric').show();
    });
    $('.shrink').click(function(){
        $('.main-menu').show();
        // $('.lyric').animate({height:'0',width:'0',opacity:'0'},1000);
        $('.lyric').hide();
    });
    if($('.btn-play').hasClass('play')){
        var deg=0;
        $('.img-wrap').css('transform','rotate('+(deg++)+')');
        if(deg>360){deg=0}
    }
});