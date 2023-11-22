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
renderer.setClearColor(0xeeeeee, 1) // Light grey background for contrast
document.body.appendChild(renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

// GLTF Loader
const loader = new GLTFLoader()
loader.load(
  'oldBag.glb',
  (gltf) => {
    const model = gltf.scene
    model.scale.set(1, 1, 1) // Scale if needed
    model.position.set(0, 0, 0) // Adjust position if needed
    scene.add(model)
  },
  undefined,
  (error) => {
    console.error('An error happened', error)
  }
)

camera.position.set(0, 1, 5) // Adjust camera position
const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
export default animate
