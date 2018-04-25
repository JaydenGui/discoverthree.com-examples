// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let controls;

let wheelFrontLeft;
let wheelFrontRight;
let wheelRearLeft;
let wheelRearRight;

function init() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#container' );

  // create a Scene
  scene = new THREE.Scene();

  initCamera();
  initControls();
  initLights();
  initMeshes();
  initRenderer();

  renderer.animate( () => {

    update();
    render();

  } );

}

function initCamera() {

  camera = new THREE.PerspectiveCamera(
    35, // FOV
    container.clientWidth / container.clientHeight, // aspect
    0.1, // near clipping plane
    100, // far clipping plane
  );

  // move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 10 );

}

function initControls() {

  controls = new THREE.OrbitControls( camera, container );

}

function initLights() {

  const ambientLight = new THREE.AmbientLight( 0x333333, 1.0 );
  scene.add( ambientLight );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 1, 100, 1 );

  // the "light-in-camera" pattern. This works very well with OrbitControls, since it
  // guarantees that a light is always shining on the target we are orbiting around
  camera.add( mainLight );
  scene.add( camera );

}

function initMaterial() {

  const textureLoader = new THREE.TextureLoader();
  // const diffuseMap = textureLoader.load( 'textures/uv_test.png' );
  const diffuseMap = textureLoader.load( 'textures/bamboo-diffuse.png' );
  diffuseMap.anisotropy = 16;

  const normalMap = textureLoader.load( 'textures/bamboo-normal.png' );
  normalMap.anisotropy = 16;

  const roughnessMap = textureLoader.load( 'textures/bamboo-roughness.png' );
  roughnessMap.anisotropy = 16;

  return new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    map: diffuseMap,
    normalMap,
    roughnessMap,
    roughness: 0.25,
    metalness: 0,
  } );

}

function initMeshes() {

  const car = new THREE.Group();
  scene.add( car );

  const material = initMaterial();

  const bodyGeometry = new THREE.BoxBufferGeometry( 3, 1, 1 );
  const body = new THREE.Mesh( bodyGeometry, material );
  // body.scale.set( 1.5, 0.5, 0.5 );
  car.add( body );

  const wheelGeo = new THREE.CylinderBufferGeometry( 0.4, 0.4, 0.15, 64, 64 );
  wheelGeo.rotateX( Math.PI / 2 );

  wheelFrontLeft = new THREE.Mesh( wheelGeo, material );
  wheelFrontLeft.position.set( -1, -0.5, 0.6 );

  wheelFrontRight = new THREE.Mesh( wheelGeo, material );
  wheelFrontRight.position.set( -1, -0.5, -0.6 );
  wheelFrontRight.rotation.z += 2.5;

  wheelRearLeft = wheelFrontLeft.clone();
  wheelRearLeft.position.x = 1;
  wheelRearLeft.rotation.z += 2.5;

  wheelRearRight = wheelFrontRight.clone();
  wheelRearRight.position.x = 1;
  wheelRearRight.rotation.z += 1.75;

  scene.add( wheelFrontLeft, wheelFrontRight, wheelRearLeft, wheelRearRight );
}

function initRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );

}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {

  const rotationSpeed = 0.01;

  wheelFrontLeft.rotation.z += rotationSpeed;
  wheelFrontRight.rotation.z += rotationSpeed;
  wheelRearLeft.rotation.z += rotationSpeed;
  wheelRearRight.rotation.z += rotationSpeed;

}

// render, or 'draw a still image', of the scene
function render() {

  renderer.render( scene, camera );

}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

// call the init function to set everything up
init();