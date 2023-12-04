import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
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
renderer.setClearColor(0x777777, 1) // Light grey background for contrast
document.body.appendChild(renderer.domElement)

// Lighting

// For a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
directionalLight.position.set(0, 10, 20) // Position above the ground
directionalLight.target.position.set(0, 0, 0) // Target at the ground
scene.add(directionalLight)
scene.add(directionalLight.target)

directionalLight.target.updateMatrixWorld()
directionalLight.updateMatrixWorld()

const pointLightHelper2 = new THREE.PointLightHelper(directionalLight)
scene.add(pointLightHelper2)

const helper2 = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(helper2)

// Ambient light

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

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
    fbx.castShadow = true
    fbx.receiveShadow = true
  },
  undefined, // Progress callback not defined
  (error) => {
    console.error('An error happened', error)
  }
)

// Ground

const groundGeometry = new THREE.PlaneGeometry(50, 50)
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2 // Rotate to horizontal
ground.position.y = -2 // Adjust height
ground.receiveShadow = true // Enable receiving shadows
scene.add(ground)

//

renderer.shadowMap.enabled = true
// pointLight.castShadow = true

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
export default animate
