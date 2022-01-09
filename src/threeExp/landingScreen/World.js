import * as THREE from "three";
import Environment from "./Environment";
import Floor from "./Floor";
import Tiles from "./Tiles";

export default class World {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;

    // Resources event listener
    document.addEventListener("ready", () => {
      // Init the environment after source ready
      console.log("ADDING");
      this.tiles = new Tiles(this.experience);
      this.environment = new Environment(this.experience);
    });
  }

  update() {
    return;
  }
}
