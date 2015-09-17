require(['jquery', 'pixi'], function ($, PIXI) {

    var renderer = PIXI.autoDetectRenderer(205, 205, {view:document.getElementById("canvas1")}, true);
    document.body.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    var background = new PIXI.Sprite.fromImage('http://localhost:8888/proxy.php?url=http%3A%2F%2Fts4.mm.bing.net%2Fth%3Fid%3DJN.IC3AVvUK%252bEtK8fLpQGUK9g%26pid%3D15.1&mimeType=image/jpeg');
    stage.addChild(background);


    //var filters = [];

    var blurFilter = new PIXI.BlurFilter();

    var overlay = PIXI.Sprite.fromImage('assets/africanSmall.jpg');


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


    function onDragStart(event)
    {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }

    function onDragEnd()
    {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
    }

    function onDragMove()
    {
        if (this.dragging)
        {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x;
            this.position.y = newPosition.y;
        }
    }


});



//overlay.on('mousedown', onDragStart);
// .on('touchstart', onDragStart)
// // events for drag end
// .on('mouseup', onDragEnd)
// .on('mouseupoutside', onDragEnd)
// .on('touchend', onDragEnd)
// .on('touchendoutside', onDragEnd)
// // events for drag move
// .on('mousemove', onDragMove)
// .on('touchmove', onDragMove);


// create some extra properties that will control movement
// overlay.direction = Math.random() * Math.PI * 2;
// // this number will be used to modify the direction of the overlay over time
// overlay.turningSpeed = Math.random() - 0.8;
// // create a random speed for the overlay between 0 - 2
// overlay.speed = 2 + Math.random() * 2;

// // create a bounding box box for the little overlays
// var overlayBoundsPadding = 100;

// var overlayBounds = new PIXI.Rectangle(-overlayBoundsPadding,
//                                     -overlayBoundsPadding,
//                                     renderer.width + overlayBoundsPadding * 2,
//                                     renderer.height + overlayBoundsPadding * 2);

// var tick = 0;

// //requestAnimationFrame(animate);


//animate();

/*function animate()
{
    // iterate through the overlays and update the positions
    for (var i = 0; i < overlayArray.length; i++)
    {
        var overlay = overlayArray[i];
        overlay.direction += overlay.turningSpeed * 0.01;
        overlay.position.x += Math.sin(overlay.direction) * overlay.speed;
        overlay.position.y += Math.cos(overlay.direction) * overlay.speed;
        overlay.rotation = -overlay.direction - Math.PI / 2;

        // wrap the overlays by testing their bounds...
        if (overlay.position.x < overlayBounds.x)
        {
            overlay.position.x += overlayBounds.width;
        }
        else if (overlay.position.x > overlayBounds.x + overlayBounds.width)
        {
            overlay.position.x -= overlayBounds.width;
        }

        if (overlay.position.y < overlayBounds.y)
        {
            overlay.position.y += overlayBounds.height;
        }
        else if (overlay.position.y > overlayBounds.y + overlayBounds.height)
        {
            overlay.position.y -= overlayBounds.height;
        }
    }

    // increment the ticker
    tick += 0.1;

    // time to render the stage !
    renderer.render(stage);

    // request another animation frame...
    requestAnimationFrame(animate);
}*/


