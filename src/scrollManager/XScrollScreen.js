/**
 * Renders and displays individual horizontal scroll screen based on data param.
 *
 * @param {number} index The vertical scroll index for this section.
 * @param {object} data The data data to be displayed.
 */
export default class XScrollScreen {
  constructor(index, data) {
    this.index = index;
    this.data = data;
    this.name = data.name;
    this.desc = data.desc;
    this.img = data.img;

    this.setNodes();
    this.setClasses();
    this.setObserver();

    // Append nodes
    this.setChildren();
  }

  setChildren() {
    this.nodes.displayDiv.appendChild(this.nodes.header);
    this.nodes.displayDiv.appendChild(this.nodes.text);
    this.nodes.article.appendChild(this.nodes.displayDiv);
    this.nodes.article.appendChild(this.nodes.observerTrigger);
  }

  /**
   * Create data nodes
   */
  setNodes() {
    this.nodes = {
      article: document.createElement("article"),
      displayDiv: document.createElement("div"),
      header: document.createElement("div"),
      text: document.createElement("h2"),
      observerTrigger: document.createElement("div"),
      img: document.createElement("img"),
    };
    this.nodes.article.setAttribute("id", `${this.name.split(" ")[0]}`);
    this.nodes.article.setAttribute("name", this.name);

    this.nodes.text.innerText = `${this.name.toUpperCase()} - ${
      this.description
    }`;

    this.nodes.observerTrigger.setAttribute("display", "none");

    // Set img src
  }

  /*
   * Create class lists based on the current data
   */
  setClasses() {
    const articleClasses =
      // Add conditional Display ordering class and xScroll layout class
      `xScreenContainer scrollX ${
        this.index === 0
          ? "currentXScroll"
          : this.index === 1
          ? "nextXScroll"
          : ""
      }`;

    this.nodes.article.setAttribute("class", articleClasses);
    this.nodes.header.setAttribute("class", "xScreenHeader");
    this.nodes.displayDiv.setAttribute("class", "xScreenInfo");
    this.nodes.observerTrigger.classList.add("observerTrigger");
  }

  setObserver() {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.onScroll();
          return;
        } else {
          this.onScrollExit();
        }
      });
    });
    sectionObserver.observe(this.nodes.observerTrigger);
  }

  /**
   * Sets an atttribute onto the article node.
   * @param {string} attribute The name of the attribute to set .
   * @param {string} value The attribute value.
   */
  setAttribute(attribute, value) {
    this.nodes.article.setAttribute(attribute, value);
  }

  onScroll() {}

  onScrollExit() {}
}
