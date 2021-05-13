import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  MeshStandardMaterial,
  BoxHelper,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const planetModel = require("./assets/models/planet/planet.glb");
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let planet;

const g = new GLTFLoader();
g.load(planetModel, (e) => {
  e.scene.traverse((child) => {
    if (child.material) {
      child.material.transparent = true;
    }
  });
  planet = e.scene;
  scene.add(planet);
  const box = new BoxHelper(e.scene, 0xffff00);
  scene.add(box);
});
camera.position.z = 55;

const light = new AmbientLight(0xffffff, 1);
light.position.y = 40;
scene.add(light);
const dirLight = new DirectionalLight(0xffffff, 1);
scene.add(dirLight);

const renderer = new WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  if (planet) {
    planet.rotation.y += 0.01;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
