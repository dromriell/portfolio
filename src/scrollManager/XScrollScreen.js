import svgIcons from "../utils/svgIcons";

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
    this.videoPaused = true;

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
    const childNodeFragment = document.createDocumentFragment();
    const descriptionItemNode = document.createElement("div");
    const imageContainerNode = document.createElement("div");
    const linkRowNode = document.createElement("div");
    const descriptionNode = document.createElement("p");
    const imageShadowContainer = document.createElement("div");
    const descriptionShadowNode = document.createElement("div");
    const descShadowNode = document.createElement("div");
    const urlAnchorNode = document.createElement("a");
    const gitHubAnchorNode = document.createElement("a");

    descriptionContainerNode.classList.add("descriptionContainer");
    descriptionItemNode.classList.add("descriptionItem");
    imageContainerNode.classList.add("appImageContainer");
    imageShadowContainer.classList.add("imgShadowContainer", "shadowContainer");
    descriptionShadowNode.classList.add(
      "descShadowContainer",
      "shadowContainer"
    );
    descShadowNode.classList.add("descShadow");
    linkRowNode.classList.add("linkRow");

    // Add description text
    descriptionNode.innerText = this.description;

    if (this.data.video_source) {
      this.videoNode = document.createElement("video");
      const sourceNode = document.createElement("source");
      const videoShadowNode = document.createElement("div");

      this.videoNode.setAttribute("muted", true);
      this.videoNode.setAttribute("poster", this.data.img_1_source || "");
      sourceNode.setAttribute("src", this.data.video_source);
      this.videoNode.classList.add(this.data.web_link ? "site" : "app");
      videoShadowNode.classList.add(
        this.data.web_link ? "siteShadow" : "appShadow"
      );
      imageShadowContainer.appendChild(videoShadowNode);
      this.videoNode.appendChild(sourceNode);
      imageContainerNode.appendChild(this.videoNode);
    }

    // Add first image if available
    if (!this.data.video_source && this.data.img_1_source) {
      const imageNode1 = document.createElement("img");
      const imageShadowNode1 = document.createElement("div");
      imageNode1.setAttribute("src", this.data.img_1_source);
      imageNode1.classList.add(this.data.web_link ? "site" : "app");
      imageShadowNode1.classList.add(
        this.data.web_link ? "siteShadow" : "appShadow"
      );
      imageShadowContainer.appendChild(imageShadowNode1);
      imageContainerNode.appendChild(imageNode1);
    }

    // Add second image if available
    if (!this.data.video_source && this.data.img_2_source) {
      const imageNode2 = document.createElement("img");
      const imageShadowNode1 = document.createElement("div");

      imageNode2.setAttribute("src", this.data.img_2_source);
      imageNode2.classList.add(this.data.web_link ? "site" : "app");
      imageShadowNode1.classList.add(
        this.data.web_link ? "siteShadow" : "appShadow"
      );
      imageShadowContainer.appendChild(imageShadowNode1);
      imageContainerNode.appendChild(imageNode2);
    }

    // Add links and icons if available
    if (this.data.web_link) {
      urlAnchorNode.innerHTML = svgIcons.link;
      urlAnchorNode.setAttribute("href", this.data.web_link);
      linkRowNode.appendChild(urlAnchorNode);
    }
    if (this.data.git_link) {
      gitHubAnchorNode.innerHTML = svgIcons.gitHub;
      gitHubAnchorNode.setAttribute("href", this.data.git_link);
      gitHubAnchorNode.addEventListener("touchend", (e) =>
        window.open(this.data.git_link, "_blank")
      );
      linkRowNode.appendChild(gitHubAnchorNode);
    }

    // Append children
    descriptionItemNode.appendChild(descriptionNode);
    descriptionItemNode.appendChild(linkRowNode);
    descriptionShadowNode.appendChild(descShadowNode);
    descriptionContainerNode.appendChild(descriptionItemNode);
    descriptionContainerNode.appendChild(descriptionShadowNode);
    imageContainerNode.appendChild(imageShadowContainer);
    childNodeFragment.appendChild(imageContainerNode);
    childNodeFragment.appendChild(descriptionContainerNode);
    this.nodes.detailField.appendChild(childNodeFragment);
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

    if (this.data.video_source) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio !== 1 && !this.videoPaused) {
              this.videoNode.pause();
              this.videoPaused = true;
            } else if (this.videoPaused) {
              this.videoNode.play();
              this.videoPaused = false;
            }
          });
        },
        { threshold: 1 }
      );

      videoObserver.observe(this.videoNode);
    }

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
