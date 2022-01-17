export default class ParallaxManager {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.element = document.createElement("div");
    this.children = [];
    this.currentIndex = 0;

    this.element.classList.add("parallaxContainer");
  }

  setBackground() {
    this.children.forEach((child) => {
      this.element.appendChild(child.element);
    });
    this.parentElement.appendChild(this.element);
    this.setIndex(this.currentIndex);
  }

  setIndex(index) {
    this.children.forEach((child, childIndex) => {
      this.clearClasses(child.element);
      if (index > childIndex) {
        child.element.classList.add("parallaxBefore");
      } else if (index === childIndex) {
        child.element.classList.add("parallaxFocus");
      } else if (index === childIndex - 1) {
        child.element.classList.add("parallaxNext");
      } else {
        child.element.classList.add("parallaxLast");
      }
    });
  }

  clearClasses(childElement) {
    childElement.classList.remove("parallaxBefore");
    childElement.classList.remove("parallaxFocus");
    childElement.classList.remove("parallaxNext");
    childElement.classList.remove("parallaxLast");
  }
}
