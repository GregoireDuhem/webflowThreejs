import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

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
renderer.shadowMap.type = THREE.VSMShadowMap

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
directionalLight.position.set(0, 20, 20) // Position above the ground
directionalLight.target.position.set(0, 0, 0) // Target at the ground
scene.add(directionalLight)
scene.add(directionalLight.target)

directionalLight.target.updateMatrixWorld()
directionalLight.updateMatrixWorld()
directionalLight.shadow.mapSize.width = 2048 // Higher resolution
directionalLight.shadow.mapSize.height = 2048 // Higher resolution

// Helper lights
const pointLightHelper2 = new THREE.PointLightHelper(directionalLight)
scene.add(pointLightHelper2)
const helper2 = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(helper2)

// GLTF Loader
let gltfModel

const loader = new GLTFLoader()
loader.load(
  'WaterBottle.gltf',
  (gltf) => {
    gltf.scene.scale.set(1, 1, 1) // Scale if needed
    gltf.scene.position.set(0, 0, 0) // Adjust position if needed
    scene.add(gltf.scene) // Add the model directly
    gltfModel = gltf.scene
    gltf.scene.castShadow = true
    gltf.scene.receiveShadow = true
    gltfModel.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true
      }
    })
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

// Renderer and shadow settings
renderer.shadowMap.enabled = true
directionalLight.castShadow = true
directionalLight.shadow.bias = -0.001

// Camera and controls
camera.position.set(0, 1, 5) // Adjust camera position
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.12

// Animation loop
function animate() {
  if (gltfModel) {
    // gltfModel.rotation.y += 0.005
  }
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

export default animate
