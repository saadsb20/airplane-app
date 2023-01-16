import * as THREE from 'three';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

export default class AirPlane {
  constructor(scene) {
    this.scene = scene;
    this.load();
  }

  load() {
    var mtlLoader = new MTLLoader();
    mtlLoader.setMaterialOptions({side:THREE.DoubleSide});
    mtlLoader.load(process.env.PUBLIC_URL+"/airplane_object/airplane1.mtl", materials => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(process.env.PUBLIC_URL+"/airplane_object/airplane1.obj", obj => {
            obj.traverse((n) => {
                if (n.isMesh) {
                  n.castShadow = true;
                  n.receiveShadow = true;
                  n.material[0] = this.engineMat;
                  n.material[1] = this.bodyMat;
                  n.material[2] = this.windowMat;
                }
              });
              obj.scale.set(0.03, 0.03, 0.03);
              obj.position.set(0, 0, 0);
              console.log("Object", obj);
              this.scene.add(obj);
            },
            (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
            (err) => console.error(err)
          );
    });
  }
}