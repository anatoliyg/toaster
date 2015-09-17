define(['jquery', 'pixi'], function ($, PIXI) {

	return ;
	renderer = PIXI.autoDetectRenderer(205, 205, {view:document.getElementById("canvas1"), preserveDrawingBuffer:true });
    document.body.appendChild(renderer.view);

    // create the root of the scene graph
    stage = new PIXI.Container();

    var background = new PIXI.Sprite.fromImage('assets/leon.jpg');
    background.width = 205;
    background.height = 205;
    stage.addChild(background);

    var overlay = PIXI.Sprite.fromImage('http://localhost:8888/proxy.php?url=http%3A%2F%2Fts4.mm.bing.net%2Fth%3Fid%3DJN.IC3AVvUK%252bEtK8fLpQGUK9g%26pid%3D15.1&mimeType=image/jpeg');
    overlay.width = 205;
    overlay.height = 205
    //overlay.filters = [blurFilter];

    overlay.anchor.set(0.5);
    overlay.scale.set(1);
    overlay.position.x = renderer.width / 2;
    overlay.position.y = renderer.height / 2;
    overlay.blendMode = PIXI.BLEND_MODES.NORMAL;
    overlay.alpha = 1;


    stage.addChild(overlay);

    setTimeout(function(){
        renderer.render(stage);
    }, 100);

	var canvas = $('canvas')[0];
	var context = canvas.getContext('2d');


	$('#opacitySlider').on('change', function(e){
		//window.overlay.alpha = 
		var alpha = $(this).val() / 100;
		overlay.alpha = alpha;
		renderer.render(stage);
	});


	$('#blendSelect').on('change', function(e){
		var blendMode = $(this).val();

		overlay.blendMode = PIXI.BLEND_MODES[blendMode];
		renderer.render(stage);
		//console.log($(this).val());
	});

	$('#grayscale').on('change', function() {
		var isChecked = $(this).is(':checked');
		if(isChecked) {
			var blurFilter = new PIXI.filters.BlurFilter();
			background.filters = [blurFilter];

			blurFilter.passes = 5;
			blurFilter.blur = 5;
			renderer.render(stage);
		}
	});

	$('#enableTint').on('change', function() {
		var isChecked = $(this).is(':checked');
		if(isChecked){
			var currValue = $('#background-color').val();
			var hex = parseInt(currValue.replace(/^#/, ''), 16);
    		background.tint = hex ? hex : 0xFFFFFF;

    		$('#background-color').show();
		}
		else{
			background.tint = 0xFFFFFF;
			$('#background-color').hide();
		}
		renderer.render(stage);
	});

	$('button').click(function() {
		var data = renderer.view.toDataURL("image/png", 1);
		//tried var data = canvas.toDataURL();
		$('img').attr('src', data);

		$.post("process.php", {
			imageData : data
		}, function(data) {
			window.location = data;
		});
	});

	function dataURItoBlob(dataURI) {
	    var binary = atob(dataURI.split(',')[1]);
	    var array = [];
	    for(var i = 0; i < binary.length; i++) {
	        array.push(binary.charCodeAt(i));
	    }
	    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
	}

	$('#background-color').on('change', function() {

		if($('#enableTint').is(':checked') ){

			var color = $(this).val();
			var hex = parseInt(color.replace(/^#/, ''), 16);
			var finalVal = hex.toString(16);

			var randColor = Math.random() * 0xFFFFFF;
			//console.log(finalVal + '  '+ randColor)
			background.tint = hex;

			renderer.render(stage);
		}
		else{
			background.tint = 0xFFFFFF;
		}
	});

	$('#opacitySlider').trigger('change');
	$('#blendSelect').trigger('change');
	$('#enableTint').trigger('change');
	$('#background-color').trigger('change');
});





