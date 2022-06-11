import AppTile from "./AppTile";

export class SectionInfo {
  constructor(data) {
    this.data = data;
    this.element = document.createElement("div");
    this.containerClass = undefined;

    this.setClasses();
    this.createChildren();
  }

  setClasses() {
    this.element.classList = "";
    this.containerClass && this.element.classList.add(this.containerClass);
  }

  createChildren() {}
}

export class AboutInfo extends SectionInfo {
  constructor(data) {
    super(data);
    this.containerClass = "aboutContainer";

    this.setClasses();
  }

  createChildren() {
    const info = document.createElement("p");
    info.innerText = this.data.description;
    this.element.appendChild(info);
  }
}

export class DevelopeInfo {
  constructor(data) {
    this.data = data;
    this.element = document.createElement("div");
    this.containerClass = "developeInfoContainer";
    this.apps = data.apps;

    this.setClasses();
    this.createChildren();
  }

  setClasses() {
    this.element.classList = "";
    this.containerClass && this.element.classList.add(this.containerClass);
  }

  createChildren() {
    this.apps.forEach((app) => {
      const projectApp = new AppTile(app);
      this.element.appendChild(projectApp.getElement());
    });
  }
}
