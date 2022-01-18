import * as THREE from "three";

export default class Bathroom {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;
    this.time = experience.time;
    this.debug = experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("bathroom");
    }

    // Setup
    this.resource = experience.resources.items.model;

    this.setTextures();
    this.setMaterial();
    this.setModel();
  }

  setTextures() {
    this.textures = {
      baked: this.resources.items.bakedTexture,
      particle: this.resources.items.particleTexture,
    };

    this.textures.baked.flipY = false;
    this.textures.baked.encoding = THREE.sRGBEncoding;
  }

  setMaterial() {
    this.materials = {
      baked: new THREE.MeshBasicMaterial({
        map: this.textures.baked,
      }),
      emissive: new THREE.MeshBasicMaterial({ color: 0xe9f1ff }),
    };
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.children.forEach((child) => {
      switch (child.name) {
        case "baked":
          child.material = this.materials.baked;
          break;
        case "sconceLightA":
          child.material = this.materials.emissive;
          break;
        case "sconceLightB":
          child.material = this.materials.emissive;
          break;
        default:
          child.material = this.materials.baked;
      }
    });

    this.model.position.set(-0.8998, -1.3914, -0.8998);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.model.position, "x", -5, 5, 0.0001)
        .name("sceneX");

      this.debugFolder
        .add(this.model.position, "y", -5, 5, 0.0001)
        .name("sceneY");

      this.debugFolder
        .add(this.model.position, "z", -5, 5, 0.0001)
        .name("sceneZ");
    }

    this.scene.add(this.model);
  }
}
