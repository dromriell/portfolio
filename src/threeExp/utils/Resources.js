import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class Resources {
  constructor(sources) {
    // Options
    this.sources = sources;

    // Events
    this.readyEvent = new CustomEvent("ready");

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath(
      new URL("../draco/", import.meta.url).href
    );
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    // Load each source or trigger ready event if empty
    if (this.toLoad === 0) {
      document.dispatchEvent(this.readyEvent);
      return;
    }

    this.sources.forEach((source) => {
      switch (source.type) {
        case "gltfModel":
          this.loaders.gltfLoader.load(source.path, (file) =>
            this.sourceLoaded(source, file)
          );
          break;
        case "texture":
          this.loaders.textureLoader.load(source.path, (file) =>
            this.sourceLoaded(source, file)
          );
          break;
        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(source.path, (file) =>
            this.sourceLoaded(source, file)
          );
          break;
        default:
          break;
      }
    });
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      document.dispatchEvent(
        new CustomEvent("ready", {
          detail: { type: source.parent },
        })
      );
    }
  }
}
