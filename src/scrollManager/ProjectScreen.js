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
    this.setClasses();

    // Append nodes
    this.nodes.displayDiv.appendChild(this.nodes.text);
    this.nodes.article.appendChild(this.nodes.displayDiv);
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
    this.nodes.article.setAttribute("name", this.name);
    this.nodes.text.innerText = `${this.name.toUpperCase()} - ${
      this.description
    }`;

    // Set img src
    const image = document.createElement("img");
    image.setAttribute("src", this.img);
    this.nodes.displayDiv.appendChild(image);
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
      }`;

    this.nodes.article.setAttribute("class", projectArticleClasses);
    this.nodes.displayDiv.setAttribute("class", "projectInfo");
  }
}
