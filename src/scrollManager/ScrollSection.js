/**
 * Full screen scroll section with optional horizontal scroll screen children.
 *
 * @param {number} index The scroll index to be assigned to this section.
 * @param {element} section The DOM element for the full screen scroll.
 * @param {boolean} isXScroll Does the element have children to be scrolled through horizontally?
 */
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

  /**
   * Sets the horizontal scroll order for the section children relative to the given
   * index param.
   * @param {number} index The next vertical index to be scrolled to.
   */
  setXScrollOrderClasses(nextIndex) {
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

  /**
   * Clears the scroll class order for current section and removes currentDisplay class
   * if one is found.
   */
  clearXScrollOrderClasses() {
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
