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
  Matrix4,
  sRGBEncoding,
  BoxHelper,
  Raycaster,
  BufferGeometry,
  Vector3,
  Line,
  SphereGeometry,
  MeshNormalMaterial,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

const planetModel = require("./assets/models/planet/planet.glb");
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let planet;
let controllerGrip1, controllerGrip2, controller1, controller2;
let raycaster,
  tempPoint,
  intersected = [];
const tempMatrix = new Matrix4();

const g = new GLTFLoader();
g.load(planetModel, (e) => {
  e.scene.traverse((child) => {
    if (child.material) {
      child.material.transparent = true;
    }
  });
  planet = e.scene;
  planet.scale.setScalar(0.3);
  planet.position.z += 10;
  scene.add(planet);
  // const box = new BoxHelper(e.scene, 0xffff00);
  // scene.add(box);
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
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

renderer.setAnimationLoop(() => {
  if (planet) {
    planet.rotation.y += 0.001;
  }

  intersectObjects(controller1);
  intersectObjects(controller2);
  renderer.render(scene, camera);
});

const setUpXRInput = () => {
  controller1 = renderer.xr.getController(0);
  controller1.addEventListener("selectstart", onSelectStart);
  controller1.addEventListener("selectend", onSelectEnd);
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener("selectstart", onSelectStart);
  controller2.addEventListener("selectend", onSelectEnd);
  scene.add(controller2);
  const controllerModelFactory = new XRControllerModelFactory();
  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(
    controllerModelFactory.createControllerModel(controllerGrip1)
  );
  scene.add(controllerGrip1);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(
    controllerModelFactory.createControllerModel(controllerGrip2)
  );
  scene.add(controllerGrip2);

  const geometry = new BufferGeometry().setFromPoints([
    new Vector3(0, 0, 0),
    new Vector3(0, 0, -1),
  ]);

  const line = new Line(geometry);
  line.name = "line";
  line.raycast = false;
  line.scale.z = 5;

  controller1.add(line.clone());
  controller2.add(line.clone());

  raycaster = new Raycaster();
};

const onSelectEnd = (e) => {};
const onSelectStart = (e) => {
  console.log(tempPoint);
  const cubeGeometry = new BoxGeometry(0.2, 0.2, 0.2);
  const cubeMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
  const marker = new Mesh(cubeGeometry, cubeMaterial);
  marker.position.copy(tempPoint);
  scene.add(marker);
  planet.attach(marker);
};

const s = new SphereGeometry(0.1, 20, 20);
const sm = new MeshNormalMaterial();
const sphere = new Mesh(s, sm);
scene.add(sphere);

// from https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_dragging.html
const intersectObjects = (controller) => {
  const intersections = getIntersections(controller);

  if (intersections && intersections.length > 0) {
    if (intersections[0].object.type == "Line") return;
    sphere.position.copy(intersections[0].point);
    tempPoint = intersections[0].point;
  }
};

const getIntersections = (controller) => {
  tempMatrix.identity().extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

  if (planet == undefined) return;
  return raycaster.intersectObjects(planet.children, true);
};

const cleanIntersected = () => {
  while (intersected.length) {
    const object = intersected.pop();
    object.material.emissive.r = 0;
  }
};

setUpXRInput();
