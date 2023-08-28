import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/grass/grass.png"), side: THREE.DoubleSide }), // RIGHT
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/grass/grass.png"), side: THREE.DoubleSide }), // LEFT
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/grass/grass.png"), side: THREE.DoubleSide }), // TOP
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/grass/grass.png"), side: THREE.DoubleSide }), // BOTTOM
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/grass/grass.png"), side: THREE.DoubleSide }), // FRONT
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/grass/grass.png"), side: THREE.DoubleSide }) // BACK
  ];

var stoneBlock =
  [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // RIGHT
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // LEFT
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // TOP
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // BOTTOM
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }), // FRONT
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("text/stone/stone.jpg"), side: THREE.DoubleSide }) // BACK
  ];

/* Create A Scene & Camera */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

/* Renderer */

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Controls */

const controls = new OrbitControls(camera, renderer.domElement);

/* Terrain Gen */

const width = 50;
const depth = 50;

const geometry = new THREE.BoxGeometry(1, 1, 1);

const grassMeshes = new THREE.InstancedMesh(geometry, grassBlock);

for (let x = 0; x < width; x++) {
  for (let z = 0; z < depth; z++) {
    const pos = new THREE.Vector2(x, z);
    const noise = fbm.get2(pos) * 10;
    const height = (Math.round((noise / 1)) * 1)

    // Add the cube

    const geometry = new THREE.BoxGeometry(1, 1, 1);


    const cube = new THREE.Mesh(geometry, grassBlock);
    cube.position.x = x;
    cube.position.y = height
    cube.position.z = z;
    scene.add(cube);

    for (let p = 0; p < (64 + height); p++) {
      const filler = new THREE.Mesh(geometry, stoneBlock);
      filler.position.x = x;
      filler.position.y = 0 - p;
      filler.position.z = z;
      scene.add(filler);
    }

  }
}



camera.position.z = 5;

var renderDistance = 5;

/* Scene Rendering */

function animate() {
  requestAnimationFrame(animate);

  scene.traverse(function (node) {

    if (node instanceof THREE.Mesh) {

      if (node.position.y - camera.position.y > renderDistance) {
        node.visible = false;
      } else if (camera.position.y - node.position.y > renderDistance) {
        node.visible = false
      } else {
        node.visible = true;
      }


    }

  });


  renderer.render(scene, camera);
}
animate();