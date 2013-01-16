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
    window.red_button = document.getElementById('red-button');
    window.canvas = document.getElementById('photo');
    window.effect = document.getElementById('effect');
    window.gallery = document.getElementById('gallery');
    window.ctx = canvas.getContext('2d');
    window.intervalId = null;
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
    window.initialized = false;
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

  video.onerror = function(e) {
    stream.stop();
  };

  stream.onended = noStream;

  video.onloadedmetadata = function(e) { // Not firing in Chrome. See crbug.com/110938.
    button.textContext = 'Take Snapshot';
    document.getElementById('splash').hidden = true;
    document.getElementById('app').hidden = false;
  };

  // Since video.onloadedmetadata isn't firing for getUserMedia video, we have
  // to fake it.
  setTimeout(function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    document.getElementById('splash').hidden = true;
    document.getElementById('app').hidden = false;
  }, 50);
}

function noStream(e) {
  var msg = 'No camera available.';
  if (e.code == 1) {
    msg = 'User denied access to use camera.';
  }
  $('#errorMessage .default').hide();
  red_button.disabled = true;
  var $error_message = $('<span>'+msg+'</span>');
  $('#errorMessage').append($error_message);
  setTimeout(function(){
    $error_message.remove();
    $('#errorMessage .default').show();
    red_button.disabled = false;
  }, 5000);
}

function capture() {

    ctx.drawImage(video, 0, 0);
    var img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');

    var angle = Math.floor(Math.random() * 36);
    var sign = Math.floor(Math.random() * 2) ? 1 : -1;
    img.style.webkitTransform = 'rotateZ(' + (sign * angle) + 'deg)';

    var maxLeft = document.body.clientWidth;
    var maxTop = document.body.clientHeight;

    img.style.top = Math.floor(Math.random() * maxTop) + 'px';
    img.style.left = Math.floor(Math.random() * maxLeft) + 'px';

    gallery.appendChild(img);

}


function addTwitter(){
  setTimeout(function(){
    $('body').append('<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>');
  }, 300)
}

function play(){
  video.play()
}


function init(el) {
  if (!navigator.getUserMedia) {
    document.getElementById('errorMessage').innerHTML = 'Sorry. <code>navigator.getUserMedia()</code> is not available.';
    return;
  }
  if(initialized){
    el.onclick = capture;
  }
  navigator.getUserMedia({video: true}, gotStream, noStream);
}

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 27) { // ESC
    document.querySelector('details').open = false;
  }
}, false);