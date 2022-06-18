/**
 * Renders and displays individual horizontal scroll screen based on data param.
 *
 * @param {number} index The vertical scroll index for this section.
 * @param {object} data The data data to be displayed.
 */
export default class XScrollScreen {
  constructor(index, data) {
    this.index = index;
    this.isAppScreen = data.is_app_screen;
    this.data = data;
    this.name = data.name;
    this.description = data.description;
    this.img = data.img_source;

    this.setNodes();
    this.setClasses();
    this.isAppScreen && this.setDetailField();
    this.setObserver();

    // Append nodes
    this.setChildren();
  }

  setChildren() {
    !this.isAppScreen && this.nodes.article.appendChild(this.nodes.displayDiv);
    this.nodes.article.appendChild(this.nodes.header);
    this.isAppScreen && this.nodes.article.appendChild(this.nodes.detailField);
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
      detailField: document.createElement("div"),
      observerTrigger: document.createElement("div"),
      img: document.createElement("img"),
    };
    this.nodes.article.setAttribute("id", `${this.name.split(" ")[0]}`);
    this.nodes.article.setAttribute("name", this.name);

    this.nodes.observerTrigger.setAttribute("display", "none");
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
    this.nodes.detailField.setAttribute("class", "xScreenAppDetail");
    this.nodes.displayDiv.setAttribute("class", "xScreenInfo");
    this.nodes.observerTrigger.classList.add("observerTrigger");
  }

  setDetailField() {
    const descriptionContainerNode = document.createElement("div");
    const imageContainerNode = document.createElement("div");
    const linkRowNode = document.createElement("div");
    const descriptionNode = document.createElement("p");
    const urlAnchorNode = document.createElement("a");
    const gitHubAnchorNode = document.createElement("a");

    descriptionContainerNode.classList.add("descriptionContainer");
    imageContainerNode.classList.add("appImageContainer");
    linkRowNode.classList.add("linkRow");

    if (this.data.img_1_source) {
      const imageNode1 = document.createElement("img");
      imageNode1.setAttribute("src", this.data.img_1_source);
      imageNode1.classList.add(this.data.web_link ? "site" : "app");
      imageContainerNode.appendChild(imageNode1);
    }

    if (this.data.img_2_source) {
      const imageNode2 = document.createElement("img");
      imageNode2.setAttribute("src", this.data.img_2_source);
      imageNode2.classList.add(this.data.web_link ? "site" : "app");
      imageContainerNode.appendChild(imageNode2);
    }

    if (this.data.web_link) {
      urlAnchorNode.innerText = "Visit";
      urlAnchorNode.setAttribute("href", this.data.web_link);
      linkRowNode.appendChild(urlAnchorNode);
    }
    if (this.data.git_link) {
      gitHubAnchorNode.innerHTML = `
      <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="github"
            class="svg-inline--fa fa-github fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          >
            <path
              fill="currentColor"
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            ></path>
          </svg>
      `;
      gitHubAnchorNode.setAttribute("href", this.data.git_link);
      gitHubAnchorNode.addEventListener("touchend", (e) =>
        window.open(this.data.git_link, "_blank")
      );
      linkRowNode.appendChild(gitHubAnchorNode);
    }
    descriptionNode.innerText = this.description;
    descriptionContainerNode.appendChild(descriptionNode);
    descriptionContainerNode.appendChild(linkRowNode);
    this.nodes.detailField.appendChild(imageContainerNode);
    this.nodes.detailField.appendChild(descriptionContainerNode);
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
