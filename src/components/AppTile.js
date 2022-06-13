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
    this.appDetails.innerText = this.project.description;
    this.appImg.src = this.project.img_src;

    this.appDetailContainer.appendChild(this.appDetails);
    this.appContainer.appendChild(this.appHeader);
    this.appContainer.appendChild(this.appImg);
    this.appContainer.appendChild(this.appDetailContainer);

    if (this.project.web_link) {
      const webLink = document.createElement("a");
      webLink.classList.add("devWebLink");
      webLink.href = this.project.web_link;
      webLink.target = "_blank";
      webLink.innerText = "Link";
      this.appDetailContainer.appendChild(webLink);
    }

    if (this.project.git_link) {
      const gitLink = document.createElement("a");
      gitLink.classList.add("devGitLink");
      gitLink.href = this.project.git_link;
      gitLink.target = "_blank";
      gitLink.innerText = "Link";
      this.appDetailContainer.appendChild(gitLink);
    }

    //  this.appContainer.addEventListener("mousedown", (e) =>
    //    console.log(this.project.web_link)
    //  );
  }

  getElement() {
    return this.appContainer;
  }
}
