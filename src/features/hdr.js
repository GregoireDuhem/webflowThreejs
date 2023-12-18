import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

const hdrTextureUrl = new URL('../../public/KitchenPierre.hdr', import.meta.url)

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 0, 7)
orbit.update()

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.8

const loader = new RGBELoader()
loader.load(hdrTextureUrl, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

let gltfModel

const loaderr = new GLTFLoader()
loaderr.load(
  'ringg.gltf',
  (gltf) => {
    gltf.scene.scale.set(50, 50, 50) // Scale if needed
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

function animate() {
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / this.window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

export default animate
