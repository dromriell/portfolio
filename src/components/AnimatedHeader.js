/**
 * Creates an animated text node that swaps CSS styles based on a trigger index or callback.
 * @param {string} title The text to be displayed by the element
 * @param {object} options JS object to change default class settings. Params include
 *                         nodeType(string), cssClasses(object),
 *                         targetContainer(DOMElement), and allCaps(bool)
 */
export default class AnimatedHeader {
  constructor(title, options = {}) {
    this.title = title;
    this.children = [];

    // Options
    this.targetContainer = options.targetContainer;
    this.allCaps = options.allCaps || false;
    this.nodeType = options.nodeType || "H2";
    this.cssClasses = options.cssClasses || {
      base: "animatedHeader",
      idle: "animatedHeaderIdle",
      active: "animatedHeaderActive",
    };

    this.element = document.createElement(this.nodeType);
    this.element.classList.add(this.cssClasses.base);

    if (this.allCaps) {
      this.title = this.title.toUpperCase();
    }
    this.titleArray = this.title.split("");

    this.createNode();
  }

  createNode() {
    const span = document.createElement("span");
    span.classList.add(this.cssClasses.idle);

    this.titleArray.forEach((character) => {
      const spanClone = span.cloneNode(false);
      spanClone.innerText = character;
      this.element.appendChild(spanClone);
      if (character !== "&") {
        this.children.push(spanClone);
      }
    });

    if (this.targetContainer) {
      this.targetContainer.appendChild(this.element);
    }
  }

  /**
   *
   * @param {number} delay Delay in ms. If isCascade set to false, will be set to 0.
   * @param {Boolean} isCascade Should animation cascade or happen at once. Default is true.
   */
  animate(isActive = true, delay = 700, isCascade = true) {
    delay = isCascade ? delay / this.children.length : 0;
    this.children.forEach((child, index) => {
      setTimeout(() => {
        if (isActive) {
          this.setActive(child);
        } else {
          this.setIdle(child);
        }
      }, delay * index);
    });
  }

  appendToTarget(parentElement) {
    parentElement.appendChild(this.element);
  }

  setActive(child) {
    child.classList.add(this.cssClasses.active);
  }

  setIdle(child) {
    child.classList.remove(this.cssClasses.active);
  }
}
