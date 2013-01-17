function hasGetUserMedia() {
  // Note: Opera is unprefixed.
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
$(function(){
  if (hasGetUserMedia()) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
    window.URL = window.URL || window.webkitURL;

    window.app = document.getElementById('app');
    window.video = document.getElementById('monitor');
    window.canvas = document.getElementById('photo');
    window.effect = document.getElementById('effect');
    window.gallery = document.getElementById('gallery');
    window.ctx = canvas.getContext('2d');
    window.intervalId = null;
    window.localMediaStream = null;
    window.idx = 0;
    window.filters = [
      'grayscale',
      'sepia',
      'blur',
      'brightness',
      'contrast',
      'hue-rotate', 'hue-rotate2', 'hue-rotate3',
      'saturate',
      'invert',
      ''
    ];
  } else {
    alert('Audio and video capture is not supported in your browser');
  }
  addTwitter();
});

function changeFilter(el) {
  el.className = '';
  var effect = filters[idx++ % filters.length];
  if (effect) {
    el.classList.add(effect);
  }
}

function gotStream(stream) {
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream; // Opera.
  }
  localMediaStream = stream; 

  video.onerror = function(e) {
    stream.stop();
  };

  stream.onended = noStream;

  video.addEventListener('loadedmetadata',function(e) { // Not firing in Chrome. See crbug.com/110938.
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    document.getElementById('splash').hidden = true;
    document.getElementById('app').hidden = false;
    $('#red-button').text('Take Snapshot');
  });

  // Since video.onloadedmetadata isn't firing for getUserMedia video, we have
  // to fake it.
  // UPDATE: no need to fake it anymore with the event listener added
  // setTimeout(function() {
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   document.getElementById('splash').hidden = true;
  //   document.getElementById('app').hidden = false;
  //   $('#red-button').text('Take Snapshot');
  // }, 200);
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
  if(localMediaStream){
    ctx.drawImage(video, 0, 0);
    var img = document.createElement('img');
    img.src = canvas.toDataURL('image/webp');
    var angle = Math.floor(Math.random() * 36);
    var sign = Math.floor(Math.random() * 2) ? 1 : -1;
    img.style.webkitTransform = 'rotateZ(' + (sign * angle) + 'deg)';
    var maxLeft = document.body.clientWidth;
    var maxTop = document.body.clientHeight;
    img.style.top = Math.floor(Math.random() * maxTop) + 'px';
    img.style.left = Math.floor(Math.random() * maxLeft) + 'px';

    gallery.appendChild(img);
  }
}


function addTwitter(){
  setTimeout(function(){
    $('body').append('<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>');
  }, 300);
}

function play(){
  video.play()
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