'use strict';

$(function() {
  var videoElement = document.querySelector('video');
  var audioSelect = document.querySelector('select#audioSource');
  var videoSelect = document.querySelector('select#videoSource');
  var photo = document.getElementById('photo');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  navigator.mediaDevices.enumerateDevices()
  .then(gotDevices).then(getStream).catch(handleError);

  audioSelect.onchange = getStream;
  videoSelect.onchange = getStream;

  function gotDevices(deviceInfos) {
  	for (var i = 0; i !== deviceInfos.length; ++i) {
  		var deviceInfo = deviceInfos[i];
  		var option = document.createElement('option');
  		option.value = deviceInfo.deviceId;
  		if (deviceInfo.kind === 'audioinput') {
  			option.text = deviceInfo.label ||
  				'microphone ' + (audioSelect.length + 1);
  			audioSelect.appendChild(option);
  		} else if (deviceInfo.kind === 'videoinput') {
  			option.text = deviceInfo.label || 'camera ' +
  				(videoSelect.length + 1);
  			videoSelect.appendChild(option);
  		} else {
  			console.log('Found one other kind of source/device: ', deviceInfo);
  		}
  	}
  }

  function getStream() {
  	if (window.stream) {
  		window.stream.getTracks().forEach(function(track) {
  			track.stop();
  		});
  	}

  	var constraints = {
  		audio: {
  			deviceId: {exact: audioSelect.value}
  		},
  		video: {
  			deviceId: {exact: videoSelect.value}
  		}
  	};

  	navigator.mediaDevices.getUserMedia(constraints).
  		then(gotStream).catch(handleError);
  }

  function gotStream(stream) {
  	window.stream = stream;
  	videoElement.srcObject = stream;
  }

  function handleError(error) {
  	console.log('Error: ', error);
  }

  $('body').on('click', '#capture', function() {
    $('#preview').modal('show');
    context.drawImage(videoElement, 0, 0, $('#canvas').width(), $('#canvas').height());
    photo.setAttribute('src', canvas.toDataURL('image/png'))
  })

  $('body').on('click', '#btn-settings', function() {
    $('#settings').modal('show');
  })


})
