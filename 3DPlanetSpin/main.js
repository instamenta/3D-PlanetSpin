import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from "gsap"
import './style.css'

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(2.5,44,23)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness:0.2
})
const geometryWire = new THREE.SphereGeometry(2.7,44, 23)
const materialWire = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  wireframe: true,
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
const meshWire = new THREE.Mesh(geometryWire, materialWire)
scene.add(meshWire)

const sizes = { 
  width: window.innerWidth,
  height: window.innerHeight,
}

const light = new THREE.PointLight(0xffffff, 1 ,100)
light.position.set(0, 10, 10)
scene.add(light)

const lightAmbient = new THREE.AmbientLight( 0x404040, 0.15 ); // soft white light
scene.add( lightAmbient );

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 10
scene.add(camera)


const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width , sizes.height)
renderer.setPixelRatio(1)
// 2

renderer.render(scene, camera)

const spaceBackground = new THREE.TextureLoader().load('space2.jpg')
scene.background = spaceBackground

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate= true
controls.autoRotateSpeed = 12

window.addEventListener('resize', ( ) => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  
  controls.update()
  light.rotation.x +=0.2
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

const tl = gsap.timeline({ defaults: {duration: 1 }})
tl.fromTo(meshWire.scale, {z: 0.2, x:0.2,y:0.2} ,{ z: 1, x:1,y:1 })
tl.fromTo(mesh.scale, {z: 0, x:0,y:0} ,{ z: 1, x:1,y:1 })
tl.fromTo('nav', {y: '-100%'}, {y: '0%'} )
tl.fromTo('.title', { opacity: 0}, {opacity: 1} )

let mouseDown = false 
let rgb = []
window.addEventListener("mousedown", () => (mouseDown=true))
window.addEventListener("mouseup", () => (mouseDown=false))

window.addEventListener("mousedown", (e) => {

  if(mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    new THREE.Color(`rgb(0,100,150)`)
    gsap.to(mesh.material.color, {
      r:newColor.r ,
      g:newColor.g ,
      b:newColor.b 
    })
    gsap.to(meshWire.material.color, {
      r:newColor.r ,
      g:newColor.g ,
      b:newColor.b 
    })
  }
})

