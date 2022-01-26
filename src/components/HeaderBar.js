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

    this.mobileMenuToggle = document.createElement("button");
    this.mobileMenu = document.createElement("ul");
    this.menuOverlay = document.createElement("div");
    this.isMobileMenuOpen = false;

    this.buttonElements = {
      header: [],
      mobile: [],
    };

    this.setAttributes();

    this.createHeaderBar();
    if (shouldSetButtons) {
      this.setHeaderBarButtons();
    }
  }

  /**
   * Set the element classes and IDs
   */
  setAttributes() {
    this.container.setAttribute("id", "headerBar");
    this.menuLeft.classList.add("headerMenu");
    this.menuRight.classList.add("headerMenu");

    this.mobileMenu.classList.add("mobileMenu");
    this.mobileMenuToggle.classList.add("mobileToggleBtn");
    this.mobileMenuToggle.innerHTML = `
      <svg viewBox="0 0 100 80" width="40" height="40" fill = "#9a8049">
        <rect width="100" height="20"></rect>
        <rect y="30" width="100" height="20"></rect>
        <rect y="60" width="100" height="20"></rect>
      </svg>`;

    this.mobileMenuToggle.addEventListener("click", () => {
      this.toggleMobileMenu();
    });
    this.menuOverlay.classList.add("menuOverlay");
  }

  /**
   * Creates the header bar element and inserts it into the document
   */
  createHeaderBar() {
    const docBody = document.querySelector("body");
    this.marker.innerText = "-- : --";
    this.container.appendChild(this.menuLeft);
    this.container.appendChild(this.marker);
    this.container.appendChild(this.menuRight);
    this.container.appendChild(this.mobileMenu);
    this.container.appendChild(this.mobileMenuToggle);

    docBody.appendChild(this.container);
    docBody.appendChild(this.menuOverlay);
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

      const mobileButton = sectionButton.cloneNode(true);

      sectionButton.addEventListener("click", () => {
        this.scrollManager.handleDirectScroll(sectionIndex);
      });
      mobileButton.addEventListener("click", () => {
        this.scrollManager.handleDirectScroll(sectionIndex);
        this.toggleMobileMenu();
      });

      if (i < 3) {
        this.menuLeft.appendChild(sectionButton);
      } else {
        this.menuRight.appendChild(sectionButton);
      }
      this.mobileMenu.appendChild(mobileButton);

      this.buttonElements.header.push(sectionButton);
      this.buttonElements.mobile.push(mobileButton);
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

  /**
   * Toggle the mobile menu state and overlay.
   */
  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.menuOverlay.classList.remove("overlayShow");
      this.mobileMenu.classList.remove("menuShow");
    } else {
      this.menuOverlay.classList.add("overlayShow");
      this.mobileMenu.classList.add("menuShow");
    }
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Highlight the current screens buttons
   */
  highlightCurrentScreen() {
    const headerButton =
      this.buttonElements.header[this.scrollManager.currentScreenIndex];
    const mobileButton =
      this.buttonElements.mobile[this.scrollManager.currentScreenIndex];
  }
}
