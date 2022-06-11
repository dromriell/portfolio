export default class AppTile {
  constructor(data) {
    this.project = data;
    this.appContainer = document.createElement("div");
    this.appHeader = document.createElement("h3");
    this.appImg = document.createElement("img");
    this.appDetailContainer = document.createElement("div");
    this.appDetails = document.createElement("p");

    this.appContainer.classList.add("devTile");
    this.appDetailContainer.classList.add("devDetails");

    this.appImg.classList.add("cover");

    this.appHeader.innerText = this.project.name;
    this.appDetails.innerText = this.project.desc;
    this.appImg.src = this.project.img_src;

    this.appDetailContainer.appendChild(this.appDetails);
    this.appContainer.appendChild(this.appHeader);
    this.appContainer.appendChild(this.appImg);
    this.appContainer.appendChild(this.appDetailContainer);
  }

  getElement() {
    return this.appContainer;
  }
}
