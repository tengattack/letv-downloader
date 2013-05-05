// Copyright (c) 2013 tengattack

$('document').ready(function() {

  var title;
  var mmsid;

  function get_page_var(varname) {
    var script = document.createElement('script');
    script.type = 'text/javascript';

    script.innerHTML = "document.body.setAttribute('data-page-var', " + varname + ");";
    
    document.head.appendChild(script);
    document.head.removeChild(script);

    return document.body.getAttribute('data-page-var');
  }

  function letv_download_url(url, videop) {
    $.get(url, function(result) {
      try {
        var resp = JSON.parse(result);
        var realurl; 
        if (resp.location) {
          var queryStringIndex = resp.location.indexOf('?');
          if (queryStringIndex === -1) {
            realurl = resp.location;
          } else {
            //realurl = resp.location.substr(0, queryStringIndex);
            realurl = resp.location.replace("&tag=ios", "")
                              .replace("&tss=ios", "")
                              .replace("&m3u8=ios", "")
                              .replace("&realext=.m3u8", "");
          }
        }

        if (realurl) {

          console.log('realurl: ' + realurl);

          var fname = "[letv][" + title + "][" + videop + "p]" + ".mp4";

          var target = {url: realurl};

          var a = document.createElement('a');
          a.download = fname;
          a.href = realurl;
          a.textContent = videop + 'p Download!';
          a.dataset.downloadurl = ['mp4', a.download, a.href].join(':');

          var jnewli = $('.seat-list .Li04 .m-d ul').append('<li style="display:none"></li>').find('li:last-child');
          var ja = jnewli.append(a).find('a');
          ja.get(0).click();
          jnewli.remove();
          
          /*target.download = true;
          target.filename = fname;
          chrome.extension.sendMessage(target)*/
          
          //chrome.downloads.download({url: realurl, filename: fname});
          
        } else {
          throw('no found download url!');
        }
      }  catch (e) {
        console.log(e);
        alert(e.toString());
      }
    });
  }

  function letv_download(videop) {
    if (!mmsid) {
      alert("没找到 mmsid ！");
      return;
    }
    var url = "http://app.m.letv.com/android/mindex.php?mod=minfo&ctl=videofile&act=index&mmsid=" + mmsid + "&videoformat=ios&pcode=010510000&version=3.3.1";
    $.get(url, function(result) {
      try {
        var resp = JSON.parse(result);
        if (resp.body && resp.body.videofile && resp.body.videofile.infos) {
          var infos = resp.body.videofile.infos;
          var mp4obj;
          switch (videop) {
            case 576:
              mp4obj = infos.mp4_1300;
              break;
            case 480:
              mp4obj = infos.mp4_1000;
              break;
            case 360:
              mp4obj = infos.mp4_350;
              break;
            default:
              throw('no this videop!');
              break;
          }

          if (mp4obj && mp4obj.mainUrl) {
            letv_download_url(mp4obj.mainUrl, videop);
          } else {
            throw('not found download url!');
          }
        }
      } catch (e) {
        console.log(e);
        alert(e.toString());
      }
    });
  }

  //console.log(__INFO__);

  function letv_download_ui_init() {
    if (!$('.seat-list')) {
      console.log('ui init failed!');
      return;
    }
    $('.seat-list').append('<li class="Li04" data-statectn="download" data-itemhldr="a">\
            <small class="frecy">\
              <span class="sl"></span>\
              <a class="js_videoDownload" href="javascript:void(0)" target="_blank" title="下载"><b>下载</b><i class="i-doc"></i></a>\
              <span class="sr"></span>\
            </small>\
            <div class="list m-d js_videoTypeList" style="z-index: 3000; display: none;" data-statectn="videoTypeList" data-itemhldr="a">\
              <ul>\
                <li><a href="javascript:void(0)" title="576p" data-videop="576">576p</a></li>\
                <li><a href="javascript:void(0)" title="480p" data-videop="480">480p</a></li>\
                <li><a href="javascript:void(0)" title="360p" data-videop="360">360p</a></li>\
              </ul>\
            </div>\
            </li>');

    $('.seat-list .Li04').mouseenter(function () {
      $('.seat-list').removeClass('active hover').addClass('download');
      $(this).find('.m-d').show();
    }).mouseleave(function() {
      $('.seat-list').removeClass('download');
      $(this).find('.m-d').hide();
    });

    $('.seat-list .Li04 .m-d a').click(function () {
      letv_download(parseInt($(this).data('videop')));
    });
  }

  setTimeout(function() {
    mmsid = get_page_var("__INFO__.video.mmsid");
    title = get_page_var("__INFO__.video.title");

    if (mmsid) {
      console.log('mmsid: ' + mmsid + '\ntitle: ' + title);

      letv_download_ui_init();
    }
  }, 0);

});