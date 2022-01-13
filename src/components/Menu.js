/**
 * Navigation element to jump from section to section.
 *
 * @param {Object} scrollManager ScrollManager instance.
 */
export default class Menu {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.elements = {
      overlay: document.querySelector(".overlay"),
      nav: document.querySelector("#retroNav"),
      buttons: {
        toggle: document.querySelector("#menuToggleBtn"),
        close: document.querySelector("#menuCloseBtn"),
        home: document.querySelector("#homeBtn"),
        works: document.querySelector("#project-1"),
        about: document.querySelector("#aboutBtn"),
        contact: document.querySelector("#contactBtn"),
      },
    };
    this.isOpen = false;

    this.setEventListeners();
  }

  setEventListeners() {
    this.elements.buttons.close.addEventListener("click", () => {
      this.toggleMenu("close");
    });
    this.elements.buttons.toggle.addEventListener("click", () => {
      this.toggleMenu("open");
    });
    for (const button of document.querySelectorAll(".menuButton")) {
      button.addEventListener(
        "click",
        (e) => {
          const index = e.currentTarget.dataset.scroll * 1;
          // this.setFocusedButton(targetElement.index);
          this.scrollManager.handleDirectScroll(index);

          this.toggleMenu("close");
        },
        true
      );
    }
  }

  /**
   * Toggles the menu to either open or closed.
   *
   * @param {string} action Action to be taken on menu. Either "close" or "open".
   */
  toggleMenu(action) {
    const body = document.querySelector("body");
    if (action === "close") {
      body.classList.remove("overflowHidden");
      this.elements.overlay.classList.remove("showOverlay");
      this.elements.nav.classList.remove("showRetroNav");
      this.isOpen = false;
      this.scrollManager.isScrollLocked = false;
    } else if (action === "open") {
      body.classList.add("overflowHidden");
      this.elements.overlay.classList.add("showOverlay");
      this.elements.nav.classList.add("showRetroNav");
      this.isOpen = true;
      this.scrollManager.isScrollLocked = true;
    }
  }

  /**
   * Highlights the current sections button.
   * @param {number} index Index of the current section.
   */
  setFocusedButton(index) {
    const targetSection = this.scrollManager.scrollOrderArray[index].element;
    const targetBtn = document.querySelector(`#${targetSection.dataset.btn}`);
    document.querySelector(".menuButton.focused")?.classList.remove("focused");
    targetBtn?.classList.add("focused");
  }
}
