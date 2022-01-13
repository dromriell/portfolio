/**
 * Creates a content table to display a list of titles/headers.
 * @param {DOM element} parentElement The parent element that the ContentTable node will be inserted.
 * @param {string} cssClass Optional, the CSS class for this element. Defaults to "contentTable".
 */
export default class ContentTable {
  constructor(parentElement, cssClass = "contentTable") {
    this.parentElement = parentElement;
    this.cssClass = cssClass;
    this.children = [];

    this.element = document.createElement("ul");
    this.element.classList.add(this.cssClass);
  }
  create() {
    this.children.forEach((child) => this.element.appendChild(child.element));
    this.parentElement.appendChild(this.element);
  }
  /**
   * Adds a child node. Must be an object/class instance with an element
   * attribute (DOM Element) in order to be used correctly with this.create.
   * @param {object} childNode AnimatedHeader instance or object with element attribute.
   */
  addChild(childNode) {
    this.children.push(childNode);
  }
}
