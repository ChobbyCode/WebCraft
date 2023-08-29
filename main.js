import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls"
import { FBM } from 'three-noise';
(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()


/* Setup The Terrain Gen Stuff */

const fbm = new FBM({
  seed: Math.random(),
  scale: 0.06,
  octaves: 6,
  persistance: 0.5,
  lacunarity: 2,
  redistribution: 1,
  height: 0
})

/* Textures */

var grassBlock =
  [
    //Right
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("text/grass/grass_block_top.png"),
      side: THREE.DoubleSide,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    }),
    //Left
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("text/grass/grass_block_top.png"),
      side: THREE.DoubleSide,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    }),
    //Top
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("text/grass/grass_block_top.png"),
      side: THREE.DoubleSide,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    }),
    //Bottom
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("text/dirt/dirt.png"),
      side: THREE.DoubleSide,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    }),
    //Front
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("text/grass/grass_block_top.png"),
      side: THREE.DoubleSide,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    }),
    //Back
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("text/grass/grass_block_top.png"),
      side: THREE.DoubleSide,
      antialias: false,
      preserveDrawingBuffer: false,
      alpha: false
    })
  ];

// var stoneBlock =
//   [
//     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // RIGHT
//     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // LEFT
//     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // TOP
//     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // BOTTOM
//     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // FRONT
//     new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }) // BACK
//   ];

/* Create A Scene & Camera */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

/* Renderer */

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Controls */

const controls = new FirstPersonControls(camera, renderer.domElement);

/* Terrain Gen */

const width = 250;
const depth = 250;

const geometry = new THREE.BoxGeometry(1, 1, 1);

// Creates a instancing mesh for each block.
const grassMeshes = new THREE.InstancedMesh(geometry, grassBlock, (width * depth) * 2);
scene.add(grassMeshes);

// Index variables for the instancing meshes to keep track of what block is what block
var grassIndex = 0;

//Instanced Rendering
const grassBlocks = new THREE.Object3D();

for (let x = 0; x < width; x++) {
  for (let z = 0; z < depth; z++) {
    const pos = new THREE.Vector2(x, z);
    const noise = fbm.get2(pos) * 10;
    const height = (Math.round((noise / 1)) * 1)

    grassBlocks.position.x = x;
    grassBlocks.position.y = height;
    grassBlocks.position.z = z;

    grassBlocks.updateMatrix();
    grassMeshes.setMatrixAt(grassIndex, grassBlocks.matrix);

    grassIndex += 1;

    grassBlocks.position.x = x;
    grassBlocks.position.y = height - 1;
    grassBlocks.position.z = z;

    grassBlocks.updateMatrix();
    grassMeshes.setMatrixAt(grassIndex, grassBlocks.matrix);

    grassIndex += 1;
  }
}

/* Setup */

camera.position.z = 5;
camera.position.x = 150;

/* Scene Rendering */

function animate() {
  requestAnimationFrame(animate);

  controls.update(0.6);


  renderer.render(scene, camera);
}
animate();