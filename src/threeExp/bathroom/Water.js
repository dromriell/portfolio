import * as THREE from "three";
import waterVertex from "./shaders/water/vertex.glsl?raw";
import waterFragment from "./shaders/water/fragment.glsl?raw";

export default class Water {
  constructor(experience) {
    this.scene = experience.scene;
    this.resources = experience.resources;
    this.time = experience.time;

    this.setTextures();
    this.setGeometry();
    this.setMaterial();
    this.setPoints();
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();

    const dropletCount = 250;

    const dropletPositionArray = new Float32Array(dropletCount * 3);
    const dropletModifier = new Float32Array(dropletCount);

    for (let i = 0; i < dropletCount; i++) {
      dropletPositionArray[i * 3 + 0] = (Math.random() - 0.5) * 0.2 + -1.47;
      dropletPositionArray[i * 3 + 1] = Math.random() - 1.5;
      dropletPositionArray[i * 3 + 2] = (Math.random() - 0.5) * 0.1 + -1.4;

      dropletModifier[i] = 2 - (Math.random() + 1);
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dropletPositionArray, 3)
    );
    this.geometry.setAttribute(
      "aMod",
      new THREE.BufferAttribute(dropletModifier, 1)
    );
  }

  setTextures() {
    this.texture = this.resources.items.particleTexture;
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      transparent: true,
      uniforms: {
        uTime: { value: this.time.elapsed },
      },
    });
  }

  setPoints() {
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    //  console.log(this.time.elapsed);
    this.material.uniforms.uTime.value = this.time.elapsed;
  }
}
