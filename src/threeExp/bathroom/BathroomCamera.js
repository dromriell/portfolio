import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class BathroomCamera {
  constructor(experience) {
    this.canvas = experience.canvas;
    this.scene = experience.scene;
    this.sizes = experience.sizes;
    this.debug = experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("bathroomCamera");
    }

    // Setup
    this.position = new THREE.Vector3(1.9272, 1.5585, 1.9272);

    // Events
    document.addEventListener("mousemove", (event) =>
      this.handleMouseMove(event)
    );
    window.addEventListener(
      "deviceorientation",
      (event) => this.handleMotion(event),
      true
    );

    this.setInstance();
    this.settOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      32.6,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.copy(this.position);

    // Debug
    if (this.debug.active) {
      this.debugFolder.add(this.instance, "fov", 0, 75, 0.01).name("fov");

      this.debugFolder
        .add(this.instance.position, "x", -5, 5, 0.0001)
        .name("x");

      this.debugFolder
        .add(this.instance.position, "y", -5, 5, 0.0001)
        .name("y");

      this.debugFolder
        .add(this.instance.position, "z", -5, 5, 0.0001)
        .name("z");
    }

    this.scene.add(this.instance);
  }

  settOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enabled = false;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
    this.instance.updateProjectionMatrix();
  }

  handleMouseMove(event) {
    event.preventDefault();
    // Normalize mouse x position
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    // Limit range to .1 of x center
    const deltaX = mouseX * 0.19272 + 1.9272;
    this.position.x = deltaX;
    this.instance.position.lerp(this.position, 0.1);
  }

  handleMotion(event) {
    const motionX = event.gamma / 90;
    const deltaX = motionX * 0.63425 + 1.9272;
    this.position.x = deltaX;
    this.instance.position.lerp(this.position, 0.1);
  }
}
