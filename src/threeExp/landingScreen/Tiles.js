import * as THREE from "three";

export default class Tiles {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;
    this.time = experience.time;
    this.debug = experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("tile");
    }

    // Setup
    this.resource = experience.resources.items.tilesModel;

    this.setTextures();
    this.setMaterial();
    this.setModel();
  }

  setTextures() {
    this.textures = {
      bakedTiles: this.resources.items.tilesBakedTexture,
      bakedFloor: this.resources.items.floorBakedTexture,
    };
    this.textures.bakedTiles.flipY = false;
    this.textures.bakedTiles.encoding = THREE.sRGBEncoding;
    this.textures.bakedFloor.flipY = false;
    this.textures.bakedFloor.encoding = THREE.sRGBEncoding;
  }

  setMaterial() {
    this.materials = {
      tiles: new THREE.MeshBasicMaterial({
        map: this.textures.bakedTiles,
      }),
      floor: new THREE.MeshBasicMaterial({
        map: this.textures.bakedFloor,
      }),
    };
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.children.forEach((child) => {
      switch (child.name) {
        case "floor":
          console.log("floor here");
          child.material = this.materials.floor;
          break;
        default:
          child.material = this.materials.tiles;
          break;
      }
    });

    this.model.position.set(-0.1623, -0.2852, -0.2852);

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
