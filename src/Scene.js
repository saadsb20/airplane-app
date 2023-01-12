import * as THREE from "three";
import * as CANNON from "cannon";
import Ground from "./Ground";
import AirPlane from "./Airplane";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export default class Scene {
    
  constructor() {
    this.init();
    this.addEvents();
  }

  addEvents() {
    window.addEventListener("resize", () => this.onWindowResize);
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
    this.camera.position.set(0, 5, 10);
    
  }

  setLights() {
    // Hemisphere light
    this.hemiLight = new THREE.HemisphereLight(0xa0cad9, 0xf2dfc9, 0.5);
    this.hemiLight.position.set(0, 10000, 50);
    this.scene.add(this.hemiLight);

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
//   onDocumentMouseMove( ) {
   

//     // event.preventDefault();

//     // if ( this.isMouseDown ) {

//     //     let theta = - ( ( event.clientX - this.onMouseDownPosition.x ) * 0.5 )
//     //             + this.onMouseDownTheta;
//     //     let phi = ( ( event.clientY - this.onMouseDownPosition.y ) * 0.5 )
//     //           + this.onMouseDownPhi;

//     //     phi = Math.min( 180, Math.max( 0, phi ) );

//     //     this.camera.position.x = this.radious * Math.sin( theta * Math.PI / 360 )
//     //                         * Math.cos( phi * Math.PI / 360 );
//     //     this.camera.position.y = this.radious * Math.sin( phi * Math.PI / 360 );
//     //     this.camera.position.z = this.radious * Math.cos( theta * Math.PI / 360 )
//     //                         * Math.cos( phi * Math.PI / 360 );
//     //     this.camera.updateMatrix();

//     // }

//     // var mouse3D = this.projector.unprojectVector(
//     //     new THREE.Vector3(
//     //         ( event.clientX / this.renderer.domElement.width ) * 2 - 1,
//     //         - ( event.clientY / this.renderer.domElement.height ) * 2 + 1,
//     //         0.5
//     //     ),
//     //     this.camera
//     // );
//     // this.ray.direction = mouse3D.subSelf( this.camera.position ).normalize();

//     // this.interact();
//     // this.render();

// }

  addObjects() {
    // New instance of the car
    this.AirPlane = new AirPlane(this.scene);
    this.ground = new Ground(this.scene);
  }

  render() {
    this.camera.lookAt(
      this.AirPlane.scene.position.x,
      this.AirPlane.scene.position.y,
      this.AirPlane.scene.position.z
    );

    this.AirPlane.scene.rotation.y += 0.01;
    
    this.renderer.render(this.scene, this.camera);    
    this.controls.update();
    // this.selectobject()
  }

  orbiteControl(){
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.target.set( 0, 0.5, 0 );
    
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
  }

//   selectobject(){
//     let draggableObject;
//     window.addEventListener('click', event => {
//         // If 'holding' object on-click, set container to <undefined> to 'drop’ the object.
//         if (draggableObject) {
//           draggableObject= undefined;
//           return;
//         }
      
//         // If NOT 'holding' object on-click, set container to <object> to 'pick up' the object.
//         this.clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         this.clickMouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
//         this.raycaster.setFromCamera(this.clickMouse, this.camera);
//         const found = this.raycaster.intersectObjects(this.scene.children, true);
//         if (found.length && found[0].object.isDraggable) {
//           draggableObject = found[0].object;
//           console.log(draggableObject)
//         }
//       });
//   }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

