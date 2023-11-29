// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff, 1) // Light grey background for contrast
document.body.appendChild(renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 200)
pointLight.position.set(0, 2, 6)
pointLight.distance = 100
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

// FBX Loader
let fbxModel

const loader = new FBXLoader()
loader.load(
  'https://gregoireduhem.github.io/threejsProd/newBag.fbx',
  (fbx) => {
    fbx.scale.set(0.1, 0.1, 0.1) // Scale if needed
    fbx.position.set(0, -2, 0) // Adjust position if needed
    scene.add(fbx) // Add the model directly
    fbxModel = fbx
  },
  undefined, // Progress callback not defined
  (error) => {
    console.error('An error happened', error)
  }
)

camera.position.set(0, 1, 5) // Adjust camera position
const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
  if (fbxModel) {
    fbxModel.rotation.y += 0.005
  }
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
// export default animate
