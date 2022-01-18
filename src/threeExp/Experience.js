import * as THREE from "three";

import Camera from "./landingScreen/TilesCamera";
import Renderer from "./Renderer";
import Resources from "./utils/Resources";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Debug from "./utils/Debug";

export default class Experience {
  constructor(canvas, sources, World, Camera) {
    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.world = new World(this);

    // Handlers
    this.handlers = {
      resize: () => {
        this.resize();
      },
      tick: () => {
        this.update();
      },
    };

    // Sizes event listener
    window.addEventListener("resize", this.handlers.resize);

    // Time tick event listener
    window.addEventListener("tick", this.handlers.tick);

    window.experience = this;
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    // CREATE DESTROY METHOD FOR EACH CLASS INSTEAD
    window.removeEventListener("resize", this.handlers.resize);
    window.removeEventListener("tick", this.handlers.tick);

    // Traverse the whole scene
    this.scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material?.dispose();
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug) {
      this.debug.gui.destroy();
    }
  }
}
