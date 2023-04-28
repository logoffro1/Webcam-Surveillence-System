
$(document).ready(function() {
	var ws = new WebSocket("ws://2902-80-114-172-251.ngrok-free.app");
	//var ws = new WebSocket("ws://127.0.0.1:8123");
	ws.onopen = function(e) {
		if (typeof console !== 'undefined') {
			console.info('WS open');
		}
	};

	ws.onmessage = function (e) {
		var d = new Date();
		var data = JSON.parse(e.data),
			type = data.type,
			i = 0,
			$webcams = $('#webcams'),
			$img = null;
			$fps = 0;
			$screenshotButton = null;
			
		$screenshotButton = $("<a id='img' href='#'> <img src ='images/camera.png' id='screenshotBtn'> </a>");
		 $fps = $("<h3>FPS: "+data.fps+"</h3>");
		if (typeof console !== 'undefined') {
			console.info('WS message', type);
		}
		if (type === 'list') {
			for (i = 0; i < data.webcams.length; i += 1) {
				$img = $("<img></img>")
					.attr("src", "webcam-capture-logo-small.jpg")
					.attr("alt", data.webcams[i])
					.attr("name", data.webcams[i]);
					$webcams.append($date)
					$webcams.append($fps)
					$webcams.append($img)
					$webcams.append($screenshotButton);
				
			}
		} else if (type === 'image') {
			var d = new Date(Date.now());
			var $date = d.getHours() + ":" + d.getMinutes() + ":"+d.getSeconds();
			var $fps = $("h3").html("Time: " + $date +" | FPS: "+data.fps);
			var $screenshotButton = $("#screenshotBtn").html("<a id='img' href='#'><img src ='images/camera.png' id='screenshotBtn'> </a>");
			$('#img').unbind('click');
			$('#img').click(function(){ saveByteArray("camera-capture",imageToDataUri(data.image,960,540)); return false; });
			var $img = $("img[name='" + data.webcam + "']")
				.attr("src", "data:image/jpeg;base64," + data.image)
				.addClass('shadow')
				.trigger("change");

		}
	};
	function imageToDataUri(imgData, width, height) {

		// create an off-screen canvas
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');
	
		// set its dimension to target size
		canvas.width = width;
		canvas.height = height;
		var uInt8Array = imgData;
		var i = uInt8Array.length;
		var binaryString = [i];
		while (i--) {
			binaryString[i] = String.fromCharCode(uInt8Array[i]);
		}
		var d = new Date(Date.now());
		var date = d.getHours() + ":" + d.getMinutes() + ":"+d.getSeconds();
		var img = new Image();
		img.src = 'data:image/jpeg;base64,'+imgData;
		// draw source image into the off-screen canvas:
		ctx.drawImage(img, 0,0, width, height);
		ctx.fillStyle = "#00FFFF";
		ctx.font = "20px Arial";
		ctx.fillText(d+" | Cosmin Cam #1", 10, 20);
		// encode image to data-uri with base64 version of compressed image
		return canvas.toDataURL("image/jpeg").split(';base64,')[1];
	}
	function saveByteArray(name, byte) {
		var blob = b64toBlob(byte,"image/jpeg");
		var blobUrl = URL.createObjectURL(blob);
		var link = document.createElement('a');
		link.href = blobUrl;
		link.download = name+Math.floor(Math.random() * 1001);+".jpg";
		link.click();
	};
	function base64ToDataUri(base64) {
		return 'data:image/png;base64,' + base64;
	}
	const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];
	  
		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		  const slice = byteCharacters.slice(offset, offset + sliceSize);
	  
		  const byteNumbers = new Array(slice.length);
		  for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		  }
	  
		  const byteArray = new Uint8Array(byteNumbers);
		  byteArrays.push(byteArray);
		}
	  
		const blob = new Blob(byteArrays, {type: contentType});
		return blob;
	  }
	ws.onclose = function() {
		if (typeof console !== 'undefined') {
			console.info('WS close');
		}
	};

	ws.onerror = function(err) {
		if (typeof console !== 'undefined') {
			console.info('WS error');
		}
	};
});
