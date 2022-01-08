export default class ScrollSection {
  constructor(index, section, isXScroll) {
    this.index = index;
    this.element = section;
    this.id = section.id;
    this.isXScroll = isXScroll;
    this.children = this.element.querySelectorAll(".scrollX");
    this.maxIndex = this.children.length - 1;
    this.currentIndex = 0;

    if (this.isXScroll) {
      this.setXScrollOrderClasses(0);
    }
  }

  setXScrollOrderClasses(nextIndex) {
    /**
     * Adds the scroll class order for current section and adds currentDisplay class
     * if any display element are found.
     */
    const nextXScroll =
      nextIndex < this.maxIndex ? this.children[nextIndex + 1] : null;
    const prevXScroll = nextIndex > 0 ? this.children[nextIndex - 1] : null;
    const currentXScroll =
      nextIndex >= 0 && nextIndex <= this.maxIndex
        ? this.children[nextIndex]
        : null;
    const currentXScrollDisplayElements =
      currentXScroll.querySelectorAll(".projectDisplay");

    nextXScroll && nextXScroll.classList.add("nextXScroll");
    prevXScroll && prevXScroll.classList.add("prevXScroll");
    currentXScroll && currentXScroll.classList.add("currentXScroll");
    for (const displayElement of currentXScrollDisplayElements) {
      displayElement.classList.add("currentDisplay");
    }
  }

  clearXScrollOrderClasses() {
    /**
     * Clears the scroll class order for current section and removes currentDisplay class
     * if one is found.
     */
    this.element.querySelector(".prevXScroll")?.classList.remove("prevXScroll");
    this.element
      .querySelector(".currentXScroll")
      ?.classList.remove("currentXScroll");
    this.element.querySelector(".nextXScroll")?.classList.remove("nextXScroll");

    for (const displayElement of this.element.querySelectorAll(
      ".currentDisplay"
    )) {
      displayElement.classList.remove("currentDisplay");
    }
  }
}
