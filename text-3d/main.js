
// standard global variables
var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();

// custom global variables
var cube;

//some constants
var    	X_AXIS = 0;
var    	Y_AXIS = 1;
var    	Z_AXIS = 2;

console.log("X_AXIS " + X_AXIS);


//------ FUNCTIONS ---------------------
//initialization
init();

// animation loop / game loop
animate();

// draw some axes
function drawAxis( axis, axisColor )
{
	var		AXIS_RADIUS   =	5.0;
	var		AXIS_HEIGHT   =	1200.0;
	var		AXIS_STEP     =	60.0;
	var    	AXIS_SEGMENTS = 32;
	var		AXIS_GRAY     = 0x777777;
	var		AXIS_WHITE    = 0xEEEEEE;
	
	//console.log("drawAxis " + axis + " ht: " +  AXIS_HEIGHT + ", " + AXIS_STEP + " color: " + axisColor);

	for ( i=0; i<(AXIS_HEIGHT/AXIS_STEP); i++ )
	{
		//console.log("loop " +  i);
		
		var pos = -AXIS_HEIGHT / 2 + i * AXIS_STEP;

		if ((i & 1) == 0)
			curColor = axisColor;
		else if (pos < 0)
			curColor = AXIS_GRAY;
		else
			curColor = AXIS_WHITE;
		
		//console.log(i + " pos: " + pos + " color: " + curColor);
		
		var geometry = new THREE.CylinderGeometry( AXIS_RADIUS, AXIS_RADIUS, AXIS_STEP, AXIS_SEGMENTS ); 
		var material = new THREE.MeshLambertMaterial( {color: curColor} ); 
		var cylinder = new THREE.Mesh( geometry, material ); 
		
		if (axis == X_AXIS)
		{
			cylinder.position.x = pos;
			cylinder.rotation.z = Math.PI/2;
		}
		else if (axis == Y_AXIS)
		{
			cylinder.rotation.y = Math.PI/2;
			cylinder.position.y = pos;
		}
		else
		{	
			cylinder.position.z = pos;
			cylinder.rotation.x = Math.PI/2;
		}
		
		scene.add( cylinder );
	};
}

function drawAxes()
{	
	console.log("X_AXIS: " + X_AXIS);
	
	drawAxis(X_AXIS, 0xff0000);
	drawAxis(Y_AXIS, 0x00ff00);
	drawAxis(Z_AXIS, 0x0000ff);
}

function init() 
{	
	//-------- SCENE -----------------
	scene = new THREE.Scene();

	//------ CAMERA ------------------
	
	// set the view size in pixels (custom or according to window size)
	// var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
	//var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	var SCREEN_WIDTH = 800, SCREEN_HEIGHT = 800;	
	// camera attributes
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	// set up camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// add the camera to the scene
	scene.add(camera);
	// the camera defaults to position (0,0,0)
	// 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	
	
	//------ RENDERER ------------------
	
	// create and start the renderer; choose antialias setting.
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	
	// attach div element to variable to contain the renderer
	container = document.getElementById( 'webgl' );
	// alert("container: " + container);
	// alternatively: to create the div at runtime, use:
	//   container = document.createElement( 'div' );
	//    document.body.appendChild( container );
	
	// attach renderer to the container div
	container.appendChild( renderer.domElement );
	
	//------ EVENTS --------------------

	
	//------ CONTROLS ------------------

	// move mouse and: left   click to rotate, 
	//                 middle click to zoom, 
	//                 right  click to pan
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	
	//------ STATS --------------------	
	// displays current and past frames per second attained by scene
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	
	//------- LIGHT -------------------
	
	// create a light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(250,250,250);
	scene.add(light);
	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);
	
	//------- GEOMETRY ----------------
		
	// most objects displayed are a "mesh":
	//  a collection of points ("geometry") and
	//  a set of surface parameters ("material")	

	// Sphere parameters: radius, segments along width, segments along height
	var sphereGeometry = new THREE.SphereGeometry( 50, 32, 16 ); 
	// use a "lambert" material rather than "basic" for realistic lighting.
	//   (don't forget to add (at least one) light!)
	var sphereMaterial = new THREE.MeshLambertMaterial( {color: 0x8888ff} ); 
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(100, 50, -50);
	scene.add(sphere);
	
	// Create an array of materials to be used in a cube, one for each side
	var cubeMaterialArray = [];
	// order to add materials: x+,x-,y+,y-,z+,z-
	cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0xff3333 } ) );
	cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0xff8800 } ) );
	cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0xffff33 } ) );
	cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x33ff33 } ) );
	cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x3333ff } ) );
	cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x8833ff } ) );
	var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
	// Cube parameters: width (x), height (y), depth (z), 
	//        (optional) segments along x, segments along y, segments along z
	var cubeGeometry = new THREE.CubeGeometry( 50, 50, 50, 1, 1, 1 );
	// using THREE.MeshFaceMaterial() in the constructor below
	//   causes the mesh to use the materials stored in the geometry
	cube = new THREE.Mesh( cubeGeometry, cubeMaterials );
	cube.position.set(-100, 50, -50);
	scene.add( cube );		

	// create a set of coordinate axes to help orient user
	//    specify length in pixels in each direction
	//var axes = new THREE.AxisHelper(100);
	//scene.add( axes );
	drawAxes();
	
	//------- FLOOR --------------------
	
	// note: 4x4 checker-board pattern scaled so that each square is 25 by 25 pixels.
	var floorTexture = new THREE.ImageUtils.loadTexture( 'checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	// DoubleSide: render texture on both sides of mesh
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	
	//------- SKY ----------------------
	
	// recommend either a skybox or fog effect (can't use both at the same time) 
	// without one of these, the scene's background color is determined by webpage background

	// make sure the camera's "far" value is large enough so that it will render the skyBox!
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	// BackSide: render faces from inside of the cube, instead of from outside (default).
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	
	// fog must be added to scene before first render
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	// delta = change in time since last call (in seconds)
	var delta = clock.getDelta(); 
	
	cube.rotation.x -= 0.05; //clock.getDelta();
	cube.rotation.y -= 0.05; //clock.getDelta();
	cube.rotation.z -= 0.05; //clock.getDelta();
	
	controls.update();
	stats.update();
}

function render() 
{	
	renderer.render( scene, camera );
}
