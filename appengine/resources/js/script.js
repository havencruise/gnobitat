function hasGetUserMedia() {
  // Note: Opera is unprefixed.
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
var gnobitat = {
  app : null,
  video : null,
  canvas : null,
  effect : null,
  gallery : null,
  ctx : null,
  intervalId : null,
  locationMediaStream : null,
  idx : null,
  filters : [
    'grayscale',
    'sepia',
    'blur',
    'brightness',
    'contrast',
    'hue-rotate', 'hue-rotate2', 'hue-rotate3',
    'saturate',
    'invert',
    ''
  ]
}
$(function(){
  if (hasGetUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    gnobitat.app = document.getElementById('app');
    gnobitat.video = document.getElementById('monitor');
    gnobitat.canvas = document.getElementById('photo');
    gnobitat.effect = document.getElementById('effect');
    gnobitat.gallery = document.getElementById('gallery');
    gnobitat.ctx = gnobitat.canvas.getContext('2d');
    gnobitat.intervalId = null;
    gnobitat.localMediaStream = null;
    gnobitat.idx = 0;
  } else {
    alert('Audio and video capture is not supported in your browser');
  }
  addTwitter();
});

function changeFilter(el) {
  el.className = '';
  var effect = gnobitat.filters[gnobitat.idx++ % gnobitat.filters.length];
  if (effect) {
    el.classList.add(effect);
  }
}

function gotStream(stream) {
  if (window.URL) {
    gnobitat.video.src = window.URL.createObjectURL(stream);
  } else {
    gnobitat.video.src = stream; // Opera.
  }
  gnobitat.localMediaStream = stream; 

  gnobitat.video.onerror = function(e) {
    stream.stop();
  };

  stream.onended = noStream;

  gnobitat.video.addEventListener('loadedmetadata',function(e) { 
    gnobitat.canvas.width = gnobitat.video.videoWidth;
    gnobitat.canvas.height = gnobitat.video.videoHeight;
    document.getElementById('splash').hidden = true;
    gnobitat.app.hidden = false;
    $('#red-button').text('Take Snapshot');
  });

  // Since video.onloadedmetadata isn't firing for getUserMedia video, we have
  // to fake it.
  // UPDATE: no need to fake it anymore with the event listener added
}

function noStream(e) {
  var msg = 'No camera available.';
  if (e.code == 1) {
    msg = 'User denied access to use camera.';
  }
  $('#errorMessage .default').hide();
  $('#red-button').attr('disabled', true);
  var $error_message = $('<span>'+msg+'</span>');
  $('#errorMessage').append($error_message);
  setTimeout(function(){
    $error_message.remove();
    $('#errorMessage .default').show();
    $('#red-button').attr('disabled', false);
  }, 5000);
}

function capture() {
  if(gnobitat.localMediaStream){
    gnobitat.ctx.drawImage(gnobitat.video, 0, 0);
    var $img = $('<img height="80" />');
    $img.attr('src', gnobitat.canvas.toDataURL('image/webp'));
    var angle = Math.floor(Math.random() * 36);
    var sign = Math.floor(Math.random() * 2) ? 1 : -1;
    $img.css('webkitTransform', 'rotateZ(' + (sign * angle) + 'deg)');
    var maxLeft = $('#gallery').width();
    var maxTop = $('#gallery').height();
    $img.css('top', Math.floor(Math.random() * maxTop) + 'px');
    $img.css('left', Math.floor(Math.random() * maxLeft) + 'px')
    $('#gallery').append($img);
  }
}

function addTwitter(){
  setTimeout(function(){
    $('body').append('<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>');
  }, 300);
}

function init(el) {
  if (!navigator.getUserMedia) {
    document.getElementById('errorMessage').innerHTML = 'Sorry. <code>navigator.getUserMedia()</code> is not available.';
    return;
  }
  el.onclick = capture;
  navigator.getUserMedia({video: true}, gotStream, noStream);
}

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 27) { // ESC
    document.querySelector('details').open = false;
  }
}, false);