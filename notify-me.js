var NotifyMe = window.NotifyMe = (function (){

  var 
    messageComp = $('<div class="nm-message"><ul class="nm-ul"></ul><div style="clear:both;"></div></div>'),
    boxContent = $('<div class="nm-content"></div>'),
    boxShadow = $('<div class="nm-shadow-bg nm-shadow-transparent"></div>'),
    box = $('<div class="nm-wrapper"></div>'),
    spacer = $('<div class="nm-spacer"></div>'),
    markers = {
      warning: 'aviso',
      error: 'erro',
      info: 'info',
      success: 'sucesso'
    };
    
  function getBottomDistance(){
    return $(window).scrollTop() + $(window).height() - ($('#footer').size() ? $('#footer').offset().top : 0);
  }
  
  $(function (){
    if ($('#footer').size()){
      spacer.insertBefore($('#footer'));
    }else{
      $('body').append(spacer);
    }
    $('body').append(box.append(boxContent,boxShadow));

    
    $(window).bind('scroll resize nmChange', function (){
    
      if (getBottomDistance() <= 0){
        box.css('bottom', '0px');
      }else{
        box.css('bottom', getBottomDistance());
      }
    }).trigger('nmChange');
    
    setInterval(function (){
      $(window).trigger('nmChange');
    },100);
    
  });
   
  function createItem(content, type, timeout){
    var msg = $('<li></li>')
      .addClass('nm-li nm-message-' + type)
      .append(
        $('<span></span>').text(markers[type]).addClass('nm-tag'),
        $('<span></span>').html(String(content)).addClass('nm-text')
      );
    if (timeout !== undefined){
      msg.delay(timeout).fadeOut(300, function (){
        setHeights();
      });
    }
    return msg;
  }
  
  function createMessage(content, type){
    if (content.length > 0){
      if (!$('.nm-message').size()){
        boxContent.append(messageComp);
      }
      if (content.length > 1 && typeof content[content.length-1] === 'number'){
        for (var i = 0, l = content.length - 1; i < l; i++){
          boxContent.find('.nm-ul').append(createItem(content[i], type, content[content.length-1]));
        }
      }else{
        for (var i = 0, l = content.length; i < l; i++){
          boxContent.find('.nm-ul').append(createItem(content[i], type));
        }
      }
      
      setHeights();
    }
  }
  
  function removeMessage(params,type){
    if (params.length === 0){
      $('.nm-message-' + type).remove();
    }else{
      $('.nm-message-' + type).each(function (index){
        if ($(this).find('span').text() === String(params[0])){
          $(this).remove();
        }else{
          for (var i = 0, l = params.length; i <l ;i++){
            if (params[i] === index){
              $(this).remove();
            }
          }
        }
      });
    }
    if (!$(boxContent).find('.nm-li').size()){
      boxContent.empty();
    }
    setHeights();
  }
  
  function setHeights(){
    boxShadow.height(boxContent.height());
    spacer.height(boxContent.outerHeight(true) + 10);
    box.height(boxContent.outerHeight(true));
    $(window).trigger('nmChange');
  }
  
  function clearBox(){
    boxContent.find('.nm-li').remove();
    boxContent.empty();
    setHeights();
  }
  
  return {
  
    preset: function (options){
      markers.error = options['error'] || 'error';
      markers.warning = options['warning'] || 'warning';
      markers.success = options['success'] || 'success';
      markers.info = options['info'] || 'info';
    },

    addError: function addError(){
      createMessage(arguments, 'error');
      return this;
    },
    
    addWarning: function addWarning(){
      createMessage(arguments, 'warning');
      return this;
    },
    
    addInfo: function addInfo(){
      createMessage(arguments, 'info');
      return this;
    },
    
    addSuccess: function addSuccess(){
      createMessage(arguments, 'success');
      return this;
    },
    
    removeError: function removeError(){
      removeMessage(arguments, 'error');
      return this;
    },
    
    removeWarning: function removeWarning(){
      removeMessage(arguments, 'warning');
      return this;
    },
    
    removeInfo: function removeInfo(){
      removeMessage(arguments, 'info');
      return this;
    },
    
    removeSuccess: function removeSuccess(){
      removeMessage(arguments, 'success');
      return this;
    },
    
    removeAll: function removeAll(){
      clearBox();
      return this;
    }
  };
})();