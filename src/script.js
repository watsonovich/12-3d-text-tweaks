import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

// Debug
const gui = new GUI();

const controlObject = {
  text: "Hello, Donuts",
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load(
  "/textures/matcaps/6D1616_E6CDBA_DE2B24_230F0F-256px.png"
);
matcapTexture1.colorSpace = THREE.SRGBColorSpace;
const matcapTexture2 = textureLoader.load("/textures/matcaps/3.png");
matcapTexture2.colorSpace = THREE.SRGBColorSpace;

const textMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture1,
});

// Fonts
const fontLoader = new FontLoader();

function buildText() {
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    // Text
    const textGeometry = new TextGeometry(controlObject.text, {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();
    const text = new THREE.Mesh(textGeometry, textMaterial);
    // console.log("text inside the fontLoader callback", text);
    scene.add(text);
  });
}

buildText();

// console.log("text outside", text);

gui.add(controlObject, "text").onFinishChange((newVal) => {
  controlObject.text = newVal;
  console.log(controlObject.text);
  buildText();
});

// Donuts
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
const donutMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture2,
});
for (let i = 0; i < 400; i++) {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);

  scene.add(donut);
}

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
