var scene, camera, renderer, origami, mesh, materials, controls, percentage, animation_step, dir, animation, rendered;

// for animation
var max_p = 400;
var delay_p = 0.1*max_p;

function init()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );

    controls = new THREE.OrbitControls( camera );

    // hack the keys...
    controls.keys = { LEFT: 39, UP: 40, RIGHT: 37, BOTTOM: 38 };

    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.0;

    controls.noZoom = false;
    controls.noPan = false;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff, 0.6 );

    document.body.appendChild( renderer.domElement );

    var ambientLight = new THREE.AmbientLight( 0x666666 );
    scene.add( ambientLight );

    var lights = [];
    lights[0] = new THREE.PointLight( 0xffffff, 1.0, 0 );
    lights[1] = new THREE.PointLight( 0xffffff, 1.0, 0 );
    lights[2] = new THREE.PointLight( 0xffffff, 1.0, 0 );
    
    lights[0].position.set( 0, 200, 0 );
    lights[1].position.set( 100, 100, 100 );
    lights[2].position.set( -100, -100, -100 );

    scene.add( lights[0] );
    scene.add( lights[1] );
    scene.add( lights[2] );

    materials = [ 
        new THREE.MeshPhongMaterial( { 
            color: 0x996633, 
            specular: 0x050505,
            shininess: 50
        }),
        // new THREE.MeshLambertMaterial({
        //     color: 0x996633, 
        // }),
        new THREE.MeshBasicMaterial({
            color: 0x000000, 
            wireframe: true, 
            wireframeLinewidth: 0.1
        })
    ];

    materials[0].side = THREE.DoubleSide;

}

function loadModel(model_url, traj_url, callback)
{
    // first remove existing model
    removeModel();

    origami = new Origami.Model();

    origami.load(model_url, traj_url, function(){

        origami.foldTo(origami.goal_cfg);

        console.log('origami loaded!');
        
        
        mesh = new THREE.Mesh( origami.geometry, materials[0] );
        edges = new THREE.Mesh( origami.geometry, materials[1] );
        mesh.name = 'mesh';
        edges.name = 'edges';
        scene.add( mesh );
        scene.add( edges );
                
        resetCamera();

        animation_step = 1;

        dir = 1;

        percentage = 0.0;

        animation = true;

        if(!rendered) render();

        if(callback) callback();
    });
}

function resetCamera()
{
    camera.position.z = origami.geometry.boundingSphere.radius * 3;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.rotation.set(0,0,0);
    controls.rotateUp(0.8);
    // controls.rotateLeft(1.57);
    controls.update();
}

function removeModel()
{
    var mesh = scene.getObjectByName('mesh');
    var edges = scene.getObjectByName('edges');
    scene.remove( mesh );
    scene.remove( edges );
}

function render()
{
    rendered = true;

    requestAnimationFrame( render );

    if(animation)
    {
        percentage += dir * animation_step;

        if(percentage > max_p + delay_p)
        {            
            dir = -1;
        }
        else if(percentage < -delay_p)
        {            
            dir = 1;
        }
    }

    origami.foldToPercentage(percentage/max_p);

    renderer.render(scene, camera);
}

$( window ).resize(function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});

$(document).keypress(function(event) {

    console.log(event.charCode);

    switch(event.charCode)
    {

        //space
        case 32: 
            animation = !animation;            
            break;
        // ','    
        case 44:
            percentage = Math.min(max_p, percentage+3*animation_step);
            animation = false;
            break;
        // '.'
        case 46:
            percentage = Math.max(0, percentage-3*animation_step);
            animation = false;
            break;
        // '[' : faster
        case 91:
            animation_step = animation_step*1.4;
            animation_step = Math.min(animation_step, 30);
            break;
        // ']' : slower
        case 93:
            animation_step = animation_step/1.4;
            animation_step = Math.max(animation_step, 0.1);
            break;
        // 'e'
        case 101:
            edges.visible = !edges.visible;
            break;
        // 't'
        case 116:        
            materials[0].opacity = materials[0].opacity == 1.0 ? 0.5 : 1.0;            
            materials[0].transparent = materials[0].opacity == 1.0 ? false : true;
            break;
        default:
            break;
    }    
});

init();




