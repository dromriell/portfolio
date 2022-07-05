import { staticUrls } from "../utils/urls";

/**
 * Element displayed at top of page that displays section and menu toggle button.
 * @param {Object} scrollManager ScrollManager instance.
 * @param {boolean} shouldSetButtons Should section buttons be set now or later? Default is true.
 */
export default class HeaderBar {
  constructor(
    scrollManager,
    shouldSetButtons = true,
    onMenuBtnPress = () => {}
  ) {
    this.scrollManager = scrollManager;
    this.onMenuBtnPress = onMenuBtnPress;

    this.container = document.createElement("nav");
    this.marker = document.createElement("h1");
    this.menuLeft = document.createElement("ul");
    this.menuRight = document.createElement("ul");

    this.mobileMenuToggle = document.createElement("button");
    this.mobileMenu = document.createElement("ul");
    this.menuOverlay = document.createElement("div");
    this.isMobileMenuOpen = false;
    this.vhsOverlay = document.querySelector(".vhsOverlay");
    this.isVHSOverlayShowing = false;

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

    ["touchstart", "click"].forEach((event) => {
      this.mobileMenuToggle.addEventListener(
        event,
        (e) => {
          this.toggleMobileMenu();
        },
        false
      );
    });

    this.menuOverlay.classList.add("menuOverlay");
    this.vhsOverlay.style.background = `url(${staticUrls.vhsOverlay})`;
    this.vhsOverlay.style.backgroundSize = "cover";
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

    docBody.prepend(this.container);
    docBody.prepend(this.menuOverlay);
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
      sectionButton.setAttribute("tabindex", 1);

      ["touchstart", "mousedown"].forEach((event) => {
        sectionButton.addEventListener(event, (e) => {
          this.toggleScrollOverlay();
          this.scrollManager.handleDirectScroll(sectionIndex);
          this.onMenuBtnPress(sectionIndex);
        });
        mobileButton.addEventListener(event, (e) => {
          e.preventDefault();
          this.scrollManager.handleDirectScroll(sectionIndex);
          this.toggleMobileMenu();
        });
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
    this.highlightCurrentScreen();
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
  highlightCurrentScreen(index) {
    this.clearHighlightedButtons();
    const selectedIndex = index
      ? index
      : this.scrollManager.getFullCurrentScreenIndex();
    const headerButton = this.buttonElements.header.find((button) => {
      return button.getAttribute("data-scroll") === selectedIndex;
    });
    const mobileButton = this.buttonElements.mobile.find((button) => {
      return button.getAttribute("data-scroll") === selectedIndex;
    });
    headerButton.setAttribute("id", "headerSelectedBTN");
    mobileButton.setAttribute("id", "mobileSelectedBTN");
  }

  /**
   * Clear all highlighted buttons
   */
  clearHighlightedButtons() {
    const highlightedHeaderButton =
      document.querySelector("#headerSelectedBTN");
    const highlightedMobileButton =
      document.querySelector("#mobileSelectedBTN");
    highlightedHeaderButton &&
      highlightedHeaderButton.removeAttribute("id", "headerSelectedBTN");
    highlightedMobileButton &&
      highlightedMobileButton.removeAttribute("id", "headerSelectedBTN");
  }

  /**
   * Toggle the VHS overlay
   */
  toggleScrollOverlay() {
    this.vhsOverlay.classList.add("showVHSOverlay");
    setTimeout(() => {
      this.vhsOverlay.classList.remove("showVHSOverlay");
    }, 500);
  }
}
