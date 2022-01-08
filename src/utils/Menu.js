export default class Menu {
  // Menu object containing all related DOM elements, state, and
  // methods to handle event listener creation and menu toggling.
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.elements = {
      overlay: document.querySelector(".overlay"),
      nav: document.querySelector("#retroNav"),
      buttons: {
        toggle: document.querySelector("#menuToggleBtn"),
        close: document.querySelector("#menuCloseBtn"),
        home: document.querySelector("#homeBtn"),
        works: document.querySelector("#worksBtn"),
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
          console.log(e.currentTarget.dataset.scroll);
          const id = `${e.currentTarget.dataset.scroll}`;
          const targetElement = this.scrollManager.scrollOrderArray.find(
            (element) => {
              console.log(element.id === id);
              return element.id === id;
            }
          );
          if (this.scrollManager.currentScreenIndex !== targetElement.index) {
            this.setFocusedButton(targetElement.index);
            this.scrollManager.handleDirectScroll(targetElement.index);
          }
          this.toggleMenu("close");
        },
        true
      );
    }
  }

  toggleMenu(action) {
    const body = document.querySelector("body");
    if (action === "close") {
      body.classList.remove("overflowHidden");
      this.elements.overlay.classList.remove("showOverlay");
      this.elements.nav.classList.remove("showRetroNav");
      this.isOpen = false;
    } else if (action === "open") {
      body.classList.add("overflowHidden");
      this.elements.overlay.classList.add("showOverlay");
      this.elements.nav.classList.add("showRetroNav");
      this.isOpen = true;
    }
  }

  setFocusedButton(index) {
    console.log(index);
    const targetSection = this.scrollManager.scrollOrderArray[index].element;
    const targetBtn = document.querySelector(`#${targetSection.dataset.btn}`);
    document.querySelector(".menuButton.focused")?.classList.remove("focused");
    targetBtn?.classList.add("focused");
  }
}
