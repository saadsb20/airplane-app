import * as THREE from "three";
import * as CANNON from "cannon";
import Ground from "./Ground";
import AirPlane from "./Airplane";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';


export default class Scene {
    
  constructor() {
    this.init();
    this.addEvents();
  }

  addEvents() {
    window.addEventListener("resize", () => this.onWindowResize);
    window.addEventListener('keydown', this.handleKeyDown);
    
  }

  init() {
    // Initialise the physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, -9.82);
    // Create the THREE Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x666c75, 0.05);
    this.setCamera();
    // this.onDocumentMouseMove();
    this.setLights();
    this.addObjects();
    this.setRenderer();
    this.orbiteControl();
    this.dragControl();
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
 

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x666c75);
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setAnimationLoop(() => {
    this.render();
     
    }); // Render 60 fps
    
    document.body.appendChild(this.renderer.domElement);
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 2, -10);
    
  }

  setLights() {
    // Hemisphere light
    this.hemiLight = new THREE.HemisphereLight(0xa0cad9, 0xf2dfc9, 0.5);
    this.hemiLight.position.set(0, 10000, 50);
    this.scene.add(this.hemiLight);
    
    this.hemiLight2 = new THREE.HemisphereLight(0xa0cad9, 0xf2dfc9, 0.3);
    this.hemiLight2.position.set(0, 1000, 11150);
    this.hemiLight2.visible=false;
    this.scene.add(this.hemiLight2);

    // Directional light
    this.dirLight = new THREE.DirectionalLight(0xffe5c9, 1.5);
    this.dirLight.position.set(0, 1000, -1000);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.bias = -0.0001;
    this.dirLight.shadow.darkness = 0.45;
    this.dirLight.shadow.mapSize.width = 1024 * 4;
    this.dirLight.shadow.mapSize.height = 1024 * 4;
    this.scene.add(this.dirLight);
  }


  addObjects() {
    // New instance of the airplane
    this.AirPlane = new AirPlane(this.scene);
    this.ground = new Ground(this.scene);
    console.log(this.AirPlane.scene)
  }

  render() {
    this.camera.lookAt(
      this.AirPlane.scene.position.x,
      this.AirPlane.scene.position.y,
      this.AirPlane.scene.position.z
    );

    // this.AirPlane.scene.rotation.y += 0.01;
    
    this.renderer.render(this.scene, this.camera);    
    this.controls.update();

    
  }

  orbiteControl(){
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.target.set( 0, 0.5, 0 ); 
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
  }
  dragControl(){
    this.controls1 = new DragControls( this.AirPlane,this.camera, this.renderer.domElement );
    this.controls1.addEventListener( 'dragstart', function ( event ) {

      event.object.material.emissive.set( 0xaaaaaa );
    
    } );
    
    this.controls1.addEventListener( 'dragend', function ( event ) {
    
      event.object.material.emissive.set( 0x000000 );
    
    } );
  }


  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 37:
        this.AirPlane.scene.rotation.y += 0.1;
        break;
      case 38:
        this.AirPlane.scene.rotation.x -= 0.1;
        break;
      case 39:
        this.AirPlane.scene.rotation.y -= 0.1;
        break;
      case 40:
        this.AirPlane.scene.rotation.x += 0.1;
        break;
      case 90:
        this.AirPlane.scene.children[4].position.z += 0.1;
        break;
      case 81:
        this.AirPlane.scene.children[4].position.x += 0.1;
        this.AirPlane.scene.children[4].rotation.z -= 0.1;
        break;
      case 83:
        this.AirPlane.scene.children[4].position.z -= 0.1;
        break;
      case 68:
        this.AirPlane.scene.children[4].position.x -= 0.1;
        this.AirPlane.scene.children[4].rotation.z += 0.1;
        break;
      case 66:
        this.AirPlane.scene.children[4].children[0].material.color.r=0.1;
        this.AirPlane.scene.children[4].children[0].material.color.g=0.1;
        this.AirPlane.scene.children[4].children[0].material.color.b=0.7;
        break;
      case 82:
        this.AirPlane.scene.children[4].children[0].material.color.g=0.05;
        this.AirPlane.scene.children[4].children[0].material.color.r=0.8;
        this.AirPlane.scene.children[4].children[0].material.color.b=0.1;
        break;
      case 71:
        this.AirPlane.scene.children[4].children[0].material.color.g=0.6;
        this.AirPlane.scene.children[4].children[0].material.color.r=0.1;
        this.AirPlane.scene.children[4].children[0].material.color.b=0.5;
        break;
      case 80:
        this.AirPlane.scene.children[4].children[3].visible?(this.AirPlane.scene.children[4].children[3].visible=false):(this.AirPlane.scene.children[4].children[3].visible=true);
        this.AirPlane.scene.children[4].children[4].visible?(this.AirPlane.scene.children[4].children[4].visible=false):(this.AirPlane.scene.children[4].children[4].visible=true);
        break;
      case 76:
        this.hemiLight2.visible?this.hemiLight2.visible=false:this.hemiLight2.visible=true;
        break;
      default : 
        break;  
    }
  }
}

