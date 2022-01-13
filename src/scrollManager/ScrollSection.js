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
    this.children = [];
    this.maxIndex = this.children.length - 1;
    this.currentIndex = 0;

    if (this.isXScroll && this.children.length > 0) {
      this.setXScrollOrderClasses(0);
    }
  }

  /**
   * Called to update instance after child added or removed from children array.
   */
  updateChildren() {
    this.maxIndex = this.children.length - 1;
    const sectionElementArray = document.createDocumentFragment();
    this.children.forEach((child) =>
      sectionElementArray.appendChild(child.nodes.article)
    );

    this.element.appendChild(sectionElementArray);

    this.setXScrollOrderClasses(0);
  }

  /**
   * Sets the horizontal scroll order for the section children relative to the given
   * index param.
   * @param {number} index The next vertical index to be scrolled to.
   */
  setXScrollOrderClasses(nextIndex) {
    this.clearXScrollOrderClasses();
    this.onScroll(nextIndex);

    // Sets all children ahead of the nextXScroll further along the +X axis
    if (nextIndex + 1 < this.maxIndex) {
      for (let i = 0; i < this.maxIndex - nextIndex - 1; i++) {
        this.children[this.maxIndex - i].nodes.article.classList.add(
          "futureXScroll"
        );
      }
    }

    // Sets all children behind the prevXScroll further along the -X axis
    if (nextIndex - 2 >= 0) {
      for (let i = 0; i < nextIndex - 1; i++) {
        this.children[i].nodes.article.classList.add("pastXScroll");
      }
    }

    const nextXScroll =
      nextIndex < this.maxIndex
        ? this.children[nextIndex + 1].nodes.article
        : null;
    const prevXScroll =
      nextIndex > 0 ? this.children[nextIndex - 1].nodes.article : null;
    const currentXScroll =
      nextIndex >= 0 && nextIndex <= this.maxIndex
        ? this.children[nextIndex].nodes.article
        : null;

    nextXScroll && nextXScroll.classList.add("nextXScroll");
    prevXScroll && prevXScroll.classList.add("prevXScroll");
    currentXScroll && currentXScroll.classList.add("currentXScroll");
  }

  /**
   * Clears the scroll class order for current section and removes currentDisplay class
   * if one is found.
   */
  clearXScrollOrderClasses() {
    this.element.querySelector(".pastXScroll")?.classList.remove("pastXScroll");
    this.element.querySelector(".prevXScroll")?.classList.remove("prevXScroll");
    this.element
      .querySelector(".currentXScroll")
      ?.classList.remove("currentXScroll");
    this.element.querySelector(".nextXScroll")?.classList.remove("nextXScroll");
    this.element
      .querySelector(".futureXScroll")
      ?.classList.remove("futureXScroll");
  }

  onScroll() {}
}
