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
    const appContainer = document.createElement("div");
    const appHeader = document.createElement("h3");
    const appImg = document.createElement("img");
    const appDetailContainer = document.createElement("div");
    const appDetails = document.createElement("p");

    appContainer.classList.add("devTile");
    appDetailContainer.classList.add("devDetails");

    this.apps.forEach((app) => {
      const appContainerClone = appContainer.cloneNode(false);
      const appDetailContainerClone = appDetailContainer.cloneNode(false);
      const appDetailsClone = appDetails.cloneNode(false);
      const appHeaderClone = appHeader.cloneNode(false);
      const appImgClone = appImg.cloneNode(false);

      appHeaderClone.innerText = app.name;
      appDetailsClone.innerText = app.desc;
      appImgClone.src = app.img;

      appDetailContainerClone.appendChild(appDetailsClone);
      appContainerClone.appendChild(appHeaderClone);
      appContainerClone.appendChild(appImgClone);
      appContainerClone.appendChild(appDetailContainerClone);
      this.element.appendChild(appContainerClone);
    });
  }
}
