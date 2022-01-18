import Environment from "./Environment";
import Tiles from "./Tiles";

export default class TilesWorld {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;

    // Resources event listener
    document.addEventListener("ready", (e) => {
      if (e.detail.type !== "tile") {
        return;
      }
      // Init the environment after source ready
      this.tiles = new Tiles(this.experience);
      this.environment = new Environment(this.experience);
    });
  }

  update() {}
}
