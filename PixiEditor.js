
function PixiEditor(container, profileUrl) {


	window.renderer = PIXI.autoDetectRenderer(400, 400, {view:container[0], preserveDrawingBuffer:true });
	//container[0].appendChild(renderer.view);

	// create the root of the scene graph
	stage = new PIXI.Container();

	var background,
		overlay;

	//console.log('assets loaded now');

	background = new PIXI.Sprite.fromImage(profileUrl);
	background.width = 400;
	background.height = 400;
	stage.addChild(background);


	setTimeout(function(){
	    renderer.render(stage);
	    launchSearch();
	}, 3000);

	// var loader = new PIXI.loaders.Loader(); // you can also create your own if you want
	// loader.add({
	// 	name: 'profile', 
	// 	url: profileUrl
	// });
	// loader.once('complete',assetsLoaded);
	// loader.load();

 //  	function assetsLoaded(loader, resources) {

 //  		console.log('assets loaded now');

 //  		background = new PIXI.Sprite.fromImage(profileUrl);
	// 	background.width = 400;
	// 	background.height = 400;
	// 	stage.addChild(background);


	// 	setTimeout(function(){
	// 	    renderer.render(stage);
	// 	    launchSearch();
	// 	}, 1000);

 //  	}


  	function  loadOverlayImage(url){

  		overlay = PIXI.Sprite.fromImage(url);
		overlay.width = 400;
		overlay.height = 400
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
		    addListeners();
		}, 1000);
  		console.log('need to load overlay image'+url);
  	}


  	function launchSearch() {
	    $('#bt_search').click(function (e) {

	        // Clear the results div.
	        $('#results').empty();
	        var query = $('#query').val();
	        var serviceOp = $('input[name=service_op]:checked', '#my_form').val();
	        if (query)
	            search(query, serviceOp);
	    });


	    $('#query').val('ny giants');
	    $('#bt_search').click();



	    // Performs the search.

	    function search(query, serviceOp) {
	        // Establish the data to pass to the proxy.
	        var data = {
	            q: query,
	            sop: serviceOp,
	            market: 'en-us'
	        };

	        // Calls the proxy, passing the query, service operation and market.
	        $.getJSON('bing_proxy.php', data, function (obj){
                if (obj.d !== undefined){
                    var items = obj.d.results;
                    for (var k = 0, len = items.length; k < len; k++){
                        var item = items[k];
                        switch (item.__metadata.type){
                        case 'WebResult':
                            showWebResult(item);
                            break;
                        case 'ImageResult':
                            showImageResult(item);
                            break;
                        }
                    }
                }
            });
	    }

	    // Shows one item of Web result.

	    function showWebResult(item){
	        var p = document.createElement('p');
	        var a = document.createElement('a');
	        a.href = item.Url;
	        $(a).append(item.Title);
	        $(p).append(item.Description);
	        // Append the anchor tag and paragraph with the description to the results div.
	        $('#results').append(a, p);
	    }

	    // Shows one item of Image result.

	    function showImageResult(item){
	        var p = document.createElement('p');
	        var a = document.createElement('a');
	        a.href = item.MediaUrl;
	        // Create an image element and set its source to the thumbnail.

	        var i = document.createElement('img');
	        // i.width = 80;
	        // i.height = 80;

	        var url = item.Thumbnail.MediaUrl;
	        var indexDot = url.lastIndexOf('.');
	        var imageType = url.slice(indexDot, url.length);

	        i.src = 'http://localhost:8888/proxy.php?url=' + encodeURIComponent(item.Thumbnail.MediaUrl)+"&mimeType=image/jpeg";
	        // Make the object that the user clicks the thumbnail image.
	        $(a).append(i);
	        $(p).append(item.Title);
	        // Append the anchor tag and paragraph with the title to the results div.
	        $('#results').append(a);

	        $(i).click(function(e){
	        	e.preventDefault();
	        	e.stopPropagation();


	        	var imgURL = $(e.target).attr('src');
	        	loadOverlayImage(imgURL)
	        })
	    }
	}
	



	//addListeners();

	function addListeners(){

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

		$('button#btnRender').click(function() {
			var data = renderer.view.toDataURL("image/png", 1);
			//tried var data = canvas.toDataURL();
			$('img').attr('src', data);

			$.post("process.php", {
				imageData : data
			}, function(data) {
				//window.location = data;
				$('#page1').hide();
             	 $('#page2').hide();
             	 $('#page3').show();


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

	}


}