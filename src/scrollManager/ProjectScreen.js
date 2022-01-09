/**
 * Renders and displays individual project section screen based on works data.
 *
 * @param {number} index The vertical scroll index for this section.
 * @param {object} project The project data to be displayed.
 */
export default class ProjectScreen {
  constructor(index, project) {
    this.index = index;
    this.project = project;
    this.type = project.type;
    this.name = project.name;
    this.tech = project.tech;
    this.desc = project.desc;
    this.priv = project.priv;
    this.img = project.img;

    this.setNodes();
    if (this.type === "combo") {
      this.setComboNodes();
    }
    this.setClasses();

    // Append nodes
    this.nodes.article.appendChild(this.nodes.displayDiv);
    this.nodes.article.appendChild(this.nodes.text);
  }

  /**
   * Create project nodes
   */
  setNodes() {
    this.nodes = {
      article: document.createElement("article"),
      displayDiv: document.createElement("div"),
      text: document.createElement("h2"),
    };
    this.nodes.article.setAttribute("id", `project-${this.index}`);
    this.nodes.text.innerText = `${this.name.toUpperCase()} - ${
      this.description
    }`;

    // Set img src
    if (this.type !== "combo") {
      const image = document.createElement("img");
      image.setAttribute("src", this.img);
      this.nodes.displayDiv.appendChild(image);
    }
  }

  /**
   * If type combo then create multiple elements and related img nodes and then append to projectDisplayDiv
   */
  setComboNodes() {
    const comboFragment = document.createDocumentFragment();
    for (const [index, comboType] of this.project.comboTypes.entries()) {
      const comboDiv = document.createElement("div");
      const comboImg = document.createElement("img");
      comboDiv.setAttribute(
        "class",
        `combo${comboType.type[0].toUpperCase()}${comboType.type.slice(1)}
            projectDisplay
            `
      );
      comboImg.setAttribute("src", comboType.img);
      comboDiv.appendChild(comboImg);
      comboFragment.appendChild(comboDiv);
    }
    this.nodes.displayDiv.appendChild(comboFragment);
  }

  /*
   * Create class lists based on the current project
   */
  setClasses() {
    const projectArticleClasses =
      // Add conditional Display ordering class and Project layout class
      `projectContainer scrollX ${
        this.index === 0
          ? "currentXScroll"
          : this.index === 1
          ? "nextXScroll"
          : ""
      } ${this.type !== "app" ? "colLayout" : ""}`;

    const projectDisplayClasses =
      // Combo type displays an app and site and currentDisplay for box shadows
      `${this.type} ${this.type !== "combo" ? "projectDisplay" : ""} ${
        this.index === 0 ? "currentDisplay" : ""
      }`;

    this.nodes.article.setAttribute("class", projectArticleClasses);
    this.nodes.displayDiv.setAttribute("class", projectDisplayClasses);
  }
}
