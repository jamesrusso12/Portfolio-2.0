$(function(){

    // to load preview on click
    var selector = $('.portfolio-item__wrapper');
    if(selector.length>0){
      selector.click(function(){
        var titleDiv = $('#iframe-content .demo-title');
        var demo_url = $(this).data('demo');
        var demo_title = $(this).data('title');
        titleDiv.text(demo_title);
        var html = '';
        html += '<div class="iframe-wrapper"><iframe id="demo-iframe" src="'+ demo_url +'">This feature requires inline frames. You have iframes disabled or your browser does not support them.</iframe></div>';
        $('.devices button[data-device-mode="desktop"]').addClass('active');
        $('#iframe-content').append(html).show();
      });
    }
  
    // to close preview 
    var closePreview = $('.preview-close');
    if(closePreview.length > 0){
      closePreview.click(function(){
        $('#iframe-content').hide().find('.iframe-wrapper').remove();
        $('.devices button').removeClass('active');
        $('#iframe-content').attr('class', '');
      });
    }
  
    //For responsiveness tab
    var responsiveTabs = $('.devices button[data-device-mode]');
    if(closePreview.length > 0){
       responsiveTabs.click(function(){
         responsiveTabs.removeClass('active');
         $(this).addClass('active');
         var deviceMode = $(this).data('device-mode');
         var targetIframe = $('#iframe-content');
         targetIframe.attr('class', deviceMode);
       });
    }
  });
