import Bathroom from "./Bathroom";
import Water from "./Water";

export default class BathroomWorld {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;

    // Resources event listener
    document.addEventListener("ready", (e) => {
      if (e.detail.type !== "bathroom") {
        return;
      }
      // Init the environment after source ready
      this.bathroom = new Bathroom(this.experience);
      this.water = new Water(this.experience);
    });
  }

  update() {
    if (this.water) {
      this.water.update();
    }
  }
}
