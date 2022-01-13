/**
 * Element displayed at top of page that displays section and menu toggle button.
 * @param {Object} scrollManager ScrollManager instance.
 * @param {boolean} shouldSetButtons Should section buttons be set now or later? Default is true.
 */
export default class HeaderBar {
  constructor(scrollManager, shouldSetButtons = true) {
    this.scrollManager = scrollManager;

    this.container = document.createElement("nav");
    this.marker = document.createElement("h1");
    this.menuLeft = document.createElement("ul");
    this.menuRight = document.createElement("ul");

    this.container.setAttribute("id", "headerBar");

    this.createHeaderBar();
    if (shouldSetButtons) {
      this.setHeaderBarButtons();
    }
  }

  /**
   * Creates the header bar element and inserts it into the document
   */
  createHeaderBar() {
    this.marker.innerText = "-- : --";
    this.container.appendChild(this.menuLeft);
    this.container.appendChild(this.marker);
    this.container.appendChild(this.menuRight);
    document.querySelector("body").appendChild(this.container);
  }

  /**
   * Collect all elements containing a btn dataset attribute and add a button for that section.
   */
  setHeaderBarButtons() {
    const buttonSections = document.querySelectorAll("[data-btn]");
    const buttonContainer = document.createElement("li");
    const buttonTitle = document.createElement("h4");
    buttonContainer.classList.add("menuButton");

    for (let i = 0; i < buttonSections.length; i++) {
      const sectionButton = buttonContainer.cloneNode(false);
      const sectionTitle = buttonTitle.cloneNode(false);
      const sectionIndex = buttonSections[i].dataset.btn;

      sectionButton.setAttribute("data-scroll", sectionIndex);
      sectionTitle.innerText = buttonSections[i]
        .getAttribute("name")
        .replace(/&/g, "");
      sectionButton.appendChild(sectionTitle);

      sectionButton.addEventListener("click", () =>
        this.scrollManager.handleDirectScroll(sectionIndex)
      );

      if (i < 3) {
        this.menuLeft.appendChild(sectionButton);
      } else {
        this.menuRight.appendChild(sectionButton);
      }
    }
  }

  /**
   * Updates the display header based on the current screen and adds additional data
   * if the screen is horizontally scrolling.
   */
  updateMarker() {
    const isXScrollSection = this.scrollManager.xScrollElArray.find(
      (element) => element.index === this.scrollManager.currentScreenIndex
    );
    const subSectionDisplay = isXScrollSection
      ? isXScrollSection.currentIndex + 1
      : 1;
    const display = `0${this.scrollManager.currentScreenIndex} : 0${subSectionDisplay}`;
    this.marker.innerText = display;
  }
}
