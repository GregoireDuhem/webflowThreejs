import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
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
  // scene.background = texture
  scene.environment = texture
})

const fbxLoader = new FBXLoader()
fbxLoader.load('ring.fbx', (fbxModel) => {
  console.log(fbxModel.getObjectByName('gold2002'))
  fbxModel.getObjectByName('gold2002').material.color.setHex(0x00ff00)
  fbxModel.traverse((child) => {
    if (child.isMesh) {
      child.material.roughness = 0
      child.material.metalness = 1.4
      child.material.envMap = texture
    }
  })

  scene.add(fbxModel)
})

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
