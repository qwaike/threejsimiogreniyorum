import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { cloneUniformsGroups } from 'three';


const loader = new THREE.TextureLoader();
const height = loader.load('height.png');
const texture = loader.load('/texture.jpg')
const alpha  = loader.load('/alpha.png');
let mousePosY = 0;

document.addEventListener('mousemove', animateTerrain)
let mouseY = 0

function animateTerrain (event){
    mouseY = event.clientY
}


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64)

// Materials

const material = new THREE.MeshStandardMaterial()
material.color = new THREE.Color('white')
material.map = texture;
material.displacementMap = height;
material.alphaMap = alpha
material.transparent = true
material.depthTest = false


gui.add(material, 'displacementScale', 0.01, 2,0.001)

// Mesh
const plane = new THREE.Mesh(geometry,material)
scene.add(plane)

gui.add(plane.rotation, 'x', -2,+2,0.01)
plane.rotation.x = -1

const guiParams = {
    color: 'rgb(255,14,20)'
}

gui.addColor(guiParams, 'color').onChange( () => {
    pointLight.color.set(guiParams.color);
})

// Lights
const lightIntensity = 1.5;
const pointLight = new THREE.PointLight('rgb(224,126,130)', lightIntensity)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(pointLight)
gui.add(pointLight.position, 'x', -2,+2,0.01).name('ışık X')
gui.add(pointLight.position, 'y', -2,+2,0.01).name('ışık Y')
gui.add(pointLight.position, 'z', -2,+5,0.01).name('ışık Z')
gui.add(pointLight, 'intensity', 0.1, 10, 0.01).name('ışık gücü')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth * .7,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth * .7
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


document.addEventListener('mousemove', (olay) => {
    mousePosY = olay.clientY
})



const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    // pointLight.intensity = Math.cos(elapsedTime)*lightIntensity

    // Update objects
    plane.rotation.z = .2 * elapsedTime

    // Update Orbital Controls
    // controls.update()


    material.displacementScale = 9 * Math.sin(mousePosY * .0003)
    console.log(material.displacementScale)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()